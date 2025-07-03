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

export const distanceSquared: {
    (a: IVector3, b: IVector3): number;
    (a: Vector2, b: Vector2): number;
} = (a: Vector2 | IVector3, b: Vector2 | IVector3): number => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    if ('z' in a && 'z' in b) {
        const dz = (a as Vector3).z - (b as Vector3).z;
        return dx * dx + dy * dy + dz * dz;
    }
    return dx * dx + dy * dy;
};
