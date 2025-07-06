import type { Vector2, Vector3 } from './types';

export const getDistanceSquared: {
    (a: Vector2, b: Vector2): number;
    (a: Vector3, b: Vector3): number;
} = (a: Vector2 | Vector3, b: Vector2 | Vector3) => {
    let distSquared = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    if ('z' in a && 'z' in b) {
        distSquared += (a.z - b.z) ** 2;
    }
    return distSquared;
};

export const getDistance: {
    (a: Vector2, b: Vector2): number;
    (a: Vector3, b: Vector3): number;
} = (a: Vector2 | Vector3, b: Vector2 | Vector3) => {
    return Math.sqrt(getDistanceSquared(a, b));
};
