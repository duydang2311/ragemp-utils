const untilPredicates: Map<
    number,
    {
        predicate: () => boolean;
        resolve: () => void;
        accMs: number;
        intervalMs: number;
    }
> = new Map();

let untilCounter = 0;
let untilRenderAdded = false;

/**
 * Returns a function that waits until the given predicate returns true, optionally with a timeout.
 * The returned function registers the predicate and resolves a promise when the predicate is satisfied.
 * This waiting is implemented using the game's 'render' event, not by polling or using setInterval.
 * If a timeout is specified and reached before the predicate returns true, the promise is rejected.
 *
 * @param predicate - A function that returns a boolean indicating whether the condition is met.
 * @returns A function that takes an optional timeout (in milliseconds) and waits for the predicate to be satisfied.
 */
export const until = (predicate: () => boolean) => {
    return (options?: { timeoutMs?: number; intervalMs?: number }) => {
        const id = ++untilCounter;
        let scopedResolve: () => void = undefined!;
        let timeout: NodeJS.Timeout | undefined;
        const promise = new Promise<void>((resolve, reject) => {
            scopedResolve = resolve;
            if (options?.timeoutMs != null) {
                timeout = setTimeout(() => {
                    reject(
                        'Timeout reached while waiting for predicate to be true'
                    );
                }, options.timeoutMs);
            }
        }).finally(() => {
            if (timeout != null) {
                clearTimeout(timeout);
            }
            untilPredicates.delete(id);
        });
        untilPredicates.set(id, {
            predicate,
            resolve: scopedResolve,
            accMs: 0,
            intervalMs: options?.intervalMs ?? 0,
        });
        if (!untilRenderAdded) {
            mp.events.add('render', handleUntilPredicatesOnRender);
            untilRenderAdded = true;
        }
        return promise;
    };
};

const handleUntilPredicatesOnRender = () => {
    for (const [_, a] of untilPredicates) {
        if (a.intervalMs > 0) {
            a.accMs += mp.game.gameplay.getFrameTime();
            if (a.accMs < a.intervalMs) {
                continue;
            }
            a.accMs = 0;
        }
        if (a.predicate()) {
            a.resolve();
        }
    }
};
