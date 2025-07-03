import type { Vector2 } from './vector';

export interface Grid2D<T> {
    /**
     * The minimum x and y coordinates of the grid.
     */
    readonly min: Vector2;

    /**
     * The maximum x and y coordinates of the grid.
     */
    readonly max: Vector2;

    /**
     * The size of each cell in the grid in pixels.
     */
    readonly cellSize: number;

    /**
     * The number of rows in the grid.
     */
    readonly rows: number;

    /**
     * The number of columns in the grid.
     */
    readonly columns: number;

    /**
     * A method to get the cell index for a given x, y coordinate.
     * @param coords - The x, y coordinates to get the cell index for.
     * @returns The index of the cell.
     * @throws {Error} If the coordinates are out of bounds for the grid.
     */
    cellAt(coords: Vector2): number;

    /**
     * A method to get the cell index for a given x, y coordinate.
     * @param coords - The x, y coordinates to get the cell index for.
     * @param radius - The radius around the coordinates to search for cells.
     * @returns The index of the cell.
     * @throws {Error} If the coordinates are out of bounds for the grid.
     */
    nearbyCells(coords: Vector2, radius: number): number[];

    /**
     * Adds an item to the grid at the specified coordinates.
     * @param item - The item to add to the grid.
     * @param coords - The x, y coordinates to add the item at.
     * @param radius - The radius around the coordinates to search for cells.
     * @return {number} The id of the item added to the grid.
     * @throws {Error} If the coordinates are out of bounds for the grid.
     */
    add(item: T, coords: Vector2, radius?: number): number;

    /**
     * Removes an item from the grid by its id.
     * @param id - The id of the item to remove.
     * @return {boolean} True if the item was removed, false otherwise.
     */
    remove(id: number): boolean;

    /**
     * Updates the coordinates and optionally the radius of an item in the grid.
     * @param id - The id of the item to update.
     * @param coords - The new x, y coordinates for the item.
     * @param radius - The new radius for the item (optional).
     * @return {boolean} True if the item was updated successfully, false if the item was not found.
     * @throws {Error} If the coordinates are out of bounds for the grid.
     */
    update(id: number, coords: Vector2, radius?: number): boolean;
}
