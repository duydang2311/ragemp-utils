import type {
    EntityType,
    StreamedMetaSchema,
} from '@duydang2311/ragemp-utils-shared';

export type StreamedMetaOnChangeFn = <
    K extends keyof StreamedMetaSchema,
    V extends StreamedMetaSchema[K]
>(
    entity: EntityMp,
    name: K,
    currentValue: V | undefined,
    previousValue: V | undefined
) => void;

export interface StreamedMetaStore {
    init(): void;
    set<K extends keyof StreamedMetaSchema>(
        entity: EntityMp,
        name: K,
        value: StreamedMetaSchema[K]
    ): void;
    delete<K extends keyof StreamedMetaSchema>(
        entity: EntityMp,
        name: K
    ): boolean;
    has<K extends keyof StreamedMetaSchema>(entity: EntityMp, name: K): boolean;
}

export interface CreateRageMpStreamedMetaStoreOptions {
    entityTypes?: Exclude<EntityType, 'blip' | 'dummy' | 'pickup'>[];
    changeEventName?: string;
    streamedInEventName?: string;
    streamedOutEventName?: string;
}

export class RageMpStreamedMetaStore implements StreamedMetaStore {
    static #poolByType = new Map<EntityType, EntityMpPool<EntityMp>>([
        // ['blip', mp.blips],
        ['checkpoint', mp.checkpoints],
        ['colshape', mp.colshapes],
        // ['dummy', mp.dummies],
        ['marker', mp.markers],
        ['object', mp.objects],
        ['player', mp.players],
        ['vehicle', mp.vehicles],
        ['ped', mp.peds],
        ['textlabel', mp.labels],
    ]);
    #entityTypes: Set<string>;
    #metas: Map<
        string,
        Map<
            keyof StreamedMetaSchema,
            StreamedMetaSchema[keyof StreamedMetaSchema]
        >
    > = new Map();
    #streamedEntitiesByPlayer: Map<PlayerMp, Set<EntityMp>> = new Map();
    #streamingPlayersByEntity: Map<EntityMp, Set<PlayerMp>> = new Map();
    #changeEventName: string;
    #streamedInEventName: string;
    #streamedOutEventName: string;

    constructor(options?: CreateRageMpStreamedMetaStoreOptions) {
        this.#entityTypes = new Set(options?.entityTypes ?? []);
        this.#changeEventName =
            options?.changeEventName ?? 'streamedMeta.change';
        this.#streamedInEventName =
            options?.streamedInEventName ?? 'streamedMeta.streamedIn';
        this.#streamedOutEventName =
            options?.streamedOutEventName ?? 'streamedMeta.streamedOut';
    }

    init(): void {
        mp.events.add(
            this.#streamedInEventName,
            (player: PlayerMp, entityType: EntityType, remoteId: number) => {
                if (!this.#entityTypes.has(entityType)) {
                    return;
                }

                const entity = RageMpStreamedMetaStore.#poolByType
                    .get(entityType)
                    ?.at(remoteId);
                if (!entity) {
                    return;
                }

                const streamedEntities =
                    this.#streamedEntitiesByPlayer.get(player);
                if (streamedEntities) {
                    streamedEntities.add(entity);
                } else {
                    this.#streamedEntitiesByPlayer.set(
                        player,
                        new Set([entity])
                    );
                }

                const players = this.#streamingPlayersByEntity.get(entity);
                if (players) {
                    players.add(player);
                } else {
                    this.#streamingPlayersByEntity.set(
                        entity,
                        new Set([player])
                    );
                }

                const metas = this.#metas.get(
                    this.#createMetaKey(entityType, remoteId)
                );
                if (metas) {
                    // TODO: bulk update in one single call instead
                    for (const [name, value] of metas.entries()) {
                        player.call(this.#changeEventName, [
                            entityType,
                            remoteId,
                            name,
                            value,
                            undefined,
                        ]);
                    }
                }
            }
        );
        mp.events.add(
            this.#streamedOutEventName,
            (player: PlayerMp, entityType: EntityType, remoteId: number) => {
                if (!this.#entityTypes.has(entityType)) {
                    return;
                }

                const entity = RageMpStreamedMetaStore.#poolByType
                    .get(entityType)
                    ?.at(remoteId);
                if (!entity) {
                    return;
                }

                const streamedEntities =
                    this.#streamedEntitiesByPlayer.get(player);
                if (streamedEntities) {
                    streamedEntities.delete(entity);
                    if (streamedEntities.size === 0) {
                        this.#streamedEntitiesByPlayer.delete(player);
                    }
                }

                const players = this.#streamingPlayersByEntity.get(entity);
                if (players) {
                    players.delete(player);
                    if (players.size === 0) {
                        this.#streamingPlayersByEntity.delete(entity);
                    }
                }
            }
        );
    }

    set<K extends keyof StreamedMetaSchema>(
        entity: EntityMp,
        name: K,
        value: StreamedMetaSchema[K]
    ): void {
        this.#assertEntityType(entity.type);

        const key = this.#createMetaKey(entity.type, entity.id);
        const store = this.#metas.get(key);
        let previousValue: StreamedMetaSchema[K] | undefined;
        if (!store) {
            this.#metas.set(key, new Map([[name, value]]));
        } else {
            previousValue = store.get(name);
            store.set(name, value);
        }

        if (value !== previousValue) {
            mp.players.call(
                this.#getPlayersStreamingEntity(entity),
                this.#changeEventName,
                [entity.type, entity.id, name, value, previousValue]
            );
        }
    }

    delete<K extends keyof StreamedMetaSchema>(
        entity: EntityMp,
        name: K
    ): boolean {
        this.#assertEntityType(entity.type);

        const key = this.#createMetaKey(entity.type, entity.id);
        const store = this.#metas.get(key);
        if (!store) {
            return false;
        }
        const previousValue = store.get(name);
        if (!store.delete(name)) {
            return false;
        }

        if (store.size === 0) {
            this.#metas.delete(key);
        }

        mp.players.call(
            this.#getPlayersStreamingEntity(entity),
            this.#changeEventName,
            [entity.type, entity.id, name, undefined, previousValue]
        );
        return true;
    }

    has<K extends keyof StreamedMetaSchema>(
        entity: EntityMp,
        name: K
    ): boolean {
        this.#assertEntityType(entity.type);
        return (
            this.#metas
                .get(this.#createMetaKey(entity.type, entity.id))
                ?.has(name) ?? false
        );
    }

    #createMetaKey(entityType: EntityType, remoteId: number): string {
        return `${entityType}:${remoteId}`;
    }

    #assertEntityType(type: EntityType): void {
        if (!this.#entityTypes.has(type)) {
            throw new Error(
                `Entity type ${type} is not supported by this store.`
            );
        }
    }

    #getPlayersStreamingEntity(entity: EntityMp) {
        const players = this.#streamingPlayersByEntity.get(entity);
        return players ? Array.from(players) : [];
    }
}
