import type { StreamedMetaSchema } from '@duydang2311/ragemp-utils-meta';
import type { EntityType } from '@duydang2311/ragemp-utils-shared';

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
    on(eventName: 'change', fn: StreamedMetaOnChangeFn): () => void;
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
    #changeHandlers: Set<StreamedMetaOnChangeFn> = new Set();
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

                for (const handler of this.#changeHandlers) {
                    handler(
                        entity,
                        name as keyof StreamedMetaSchema,
                        current,
                        previous
                    );
                }
            }
        );
    }

    public on(eventName: 'change', fn: StreamedMetaOnChangeFn): () => void;
    public on(eventName: string, fn: StreamedMetaOnChangeFn) {
        switch (eventName) {
            case 'change':
                this.#changeHandlers.add(fn);
                break;
            default:
                throw new Error(`Unsupported event: ${eventName}`);
        }

        return () => {
            this.#changeHandlers.delete(fn);
        };
    }
}
