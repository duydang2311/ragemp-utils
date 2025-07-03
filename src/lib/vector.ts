/**
 * Represents a 2D vector with x and y coordinates.
 */
export interface Vector2 {
    /**
     * The x coordinate of the vector.
     */
    readonly x: number;

    /**
     * The y coordinate of the vector.
     */
    readonly y: number;
}

/**
 * Represents a 3D vector with x, y, and z coordinates.
 */
export interface Vector3 extends Vector2 {
    /**
     * The z coordinate of the vector.
     */
    readonly z: number;
}

interface DistanceSquaredFn {
    (a: Vector2, b: Vector2): number;
    (a: Vector3, b: Vector3): number;
}

export const distanceSquared: DistanceSquaredFn = (
    a: Vector2 | Vector3,
    b: Vector2 | Vector3
): number => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    if ('z' in a && 'z' in b) {
        const dz = (a as Vector3).z - (b as Vector3).z;
        return dx * dx + dy * dy + dz * dz;
    }
    return dx * dx + dy * dy;
};
