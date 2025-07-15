export const renderPromise = <T>(
    fn: (
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void
    ) => void
) => {
    let scopedResolve: (value: T | PromiseLike<T>) => void = undefined!;
    let scopedReject: (reason?: any) => void = undefined!;
    const promise = new Promise<T>((resolve, reject) => {
        scopedResolve = (value) => {
            resolve(value);
            mp.events.remove('render', wrapped);
        };
        scopedReject = (reason) => {
            reject(reason);
            mp.events.remove('render', wrapped);
        };
    });

    const wrapped = () => {
        fn(scopedResolve, scopedReject);
    };
    mp.events.add('render', wrapped);
    return promise;
};
