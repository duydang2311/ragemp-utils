import type { StreamedMetaSchema } from '@duydang2311/ragemp-utils-meta';
import type { EntityType } from '@duydang2311/ragemp-utils-shared';

export type StreamedMetaOnChangeFn<V> = (
    entity: EntityMp,
    currentValue: V | undefined,
    previousValue: V | undefined
) => void;

export interface StreamedMetaStore {
    init(): void;
    on<K extends keyof StreamedMetaSchema, V extends StreamedMetaSchema[K]>(
        eventName: 'change',
        name: K,
        fn: StreamedMetaOnChangeFn<V>
    ): () => void;
}

export interface CreateRageMpStreamedMetaStoreOptions {
    entityTypes?: Exclude<EntityType, 'blip' | 'dummy'>[];
    changeEventName?: string;
    streamedInEventName?: string;
    streamedOutEventName?: string;
    debug?: boolean;
}

export class RageMpStreamedMetaStore implements StreamedMetaStore {
    static #poolByType = new Map<EntityType, EntityMpPool<EntityMp>>([
        // ['blip', mp.blips],
        ['checkpoint', mp.checkpoints],
        ['colshape', mp.colshapes],
        // ['dummy', mp.dummies],
        ['marker', mp.markers],
        ['object', mp.objects],
        ['pickup', mp.pickups],
        ['player', mp.players],
        ['vehicle', mp.vehicles],
        ['ped', mp.peds],
        ['textlabel', mp.labels],
    ]);
    #changeHandlersByName: Map<string, Set<StreamedMetaOnChangeFn<unknown>>> =
        new Map();
    #entityTypes: Set<string>;
    #changeEventName: string;
    #streamedInEventName: string;
    #streamedOutEventName: string;
    #debug: boolean;

    constructor(options?: CreateRageMpStreamedMetaStoreOptions) {
        this.#entityTypes = new Set(options?.entityTypes ?? []);
        this.#changeEventName =
            options?.changeEventName ?? 'streamedMeta.change';
        this.#streamedInEventName =
            options?.streamedInEventName ?? 'streamedMeta.streamedIn';
        this.#streamedOutEventName =
            options?.streamedOutEventName ?? 'streamedMeta.streamedOut';
        this.#debug = options?.debug ?? false;
    }

    init() {
        mp.events.add('entityStreamIn', (entity: EntityMp) => {
            if (this.#debug) {
                mp.console.logInfo(
                    `[StreamedMetaStore] entityStreamIn, ${entity.type}, ${entity.remoteId}`
                );
            }
            if (!this.#entityTypes.has(entity.type)) {
                return;
            }
            mp.events.callRemote(
                this.#streamedInEventName,
                entity.type,
                entity.remoteId
            );
        });
        mp.events.add('entityStreamOut', (entity: EntityMp) => {
            if (this.#debug) {
                mp.console.logInfo(
                    `[StreamedMetaStore] entityStreamOut, ${entity.type}, ${entity.remoteId}`
                );
            }
            if (!this.#entityTypes.has(entity.type)) {
                return;
            }
            mp.events.callRemote(
                this.#streamedOutEventName,
                entity.type,
                entity.remoteId
            );
        });
        mp.events.add(
            this.#changeEventName,
            (
                type: EntityType,
                remoteId: number,
                name: string,
                current: any,
                previous: any
            ) => {
                if (this.#debug) {
                    mp.console.logInfo(
                        `[StreamedMetaStore] ${
                            this.#changeEventName
                        }, ${type}, ${remoteId}, ${name}, ${current}, ${previous}`
                    );
                }
                const pool = RageMpStreamedMetaStore.#poolByType.get(type);
                if (!pool) {
                    return;
                }

                const entity = pool.atRemoteId(remoteId);
                if (!entity || !pool.exists(entity)) {
                    return;
                }

                const handlers = this.#changeHandlersByName.get(name);
                if (handlers) {
                    for (const handler of handlers) {
                        handler(entity, current, previous);
                    }
                }
            }
        );
    }

    public on<
        K extends keyof StreamedMetaSchema,
        V extends StreamedMetaSchema[K]
    >(eventName: 'change', name: K, fn: StreamedMetaOnChangeFn<V>): () => void;
    public on<
        K extends keyof StreamedMetaSchema,
        V extends StreamedMetaSchema[K]
    >(eventName: 'change', name: K, fn: StreamedMetaOnChangeFn<V>) {
        switch (eventName) {
            case 'change':
                let handlers = this.#changeHandlersByName.get(name);
                if (!handlers) {
                    handlers = new Set<StreamedMetaOnChangeFn<unknown>>([
                        fn as StreamedMetaOnChangeFn<unknown>,
                    ]);
                    this.#changeHandlersByName.set(
                        name,
                        new Set<StreamedMetaOnChangeFn<unknown>>([
                            fn as StreamedMetaOnChangeFn<unknown>,
                        ])
                    );
                } else {
                    handlers.add(fn as StreamedMetaOnChangeFn<unknown>);
                }
                return () => {
                    handlers.delete(fn as StreamedMetaOnChangeFn<unknown>);
                    if (handlers.size === 0) {
                        this.#changeHandlersByName.delete(name);
                    }
                };
            default:
                throw new Error(`Unsupported event: ${eventName}`);
        }
    }
}
