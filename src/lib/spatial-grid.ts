import type { Grid2D } from './grid';
import type { Vector2 } from './vector';

export interface CreateSpatialGrid2DOptions {
    min?: Vector2;
    max?: Vector2;
    cellSize?: number;
}

type CellItem<T> = [id: number, item: T, radius?: number];
type CellItemLookup = [cells: number[]];

export class SpatialGrid2D<T> implements Grid2D<T> {
    static readonly DEFAULT_MIN_X = -4000;
    static readonly DEFAULT_MAX_X = 4000;
    static readonly DEFAULT_MIN_Y = -4000;
    static readonly DEFAULT_MAX_Y = 8000;
    static readonly DEFAULT_CELL_SIZE = 128;

    #idCounter: number;
    #min: Vector2;
    #max: Vector2;
    #rows: number;
    #columns: number;
    #cells: CellItem<T>[][];
    #cellSize: number;
    #idLookup: Map<number, CellItemLookup> = new Map();

    constructor(options?: CreateSpatialGrid2DOptions) {
        this.#idCounter = 0;
        this.#min = options?.min ?? {
            x: SpatialGrid2D.DEFAULT_MIN_X,
            y: SpatialGrid2D.DEFAULT_MIN_Y,
        };
        this.#max = options?.max ?? {
            x: SpatialGrid2D.DEFAULT_MAX_X,
            y: SpatialGrid2D.DEFAULT_MAX_Y,
        };
        this.#cellSize = options?.cellSize ?? SpatialGrid2D.DEFAULT_CELL_SIZE;
        this.#rows = Math.ceil((this.#max.y - this.#min.y) / this.#cellSize);
        this.#columns = Math.ceil((this.#max.x - this.#min.x) / this.#cellSize);
        this.#cells = new Array(this.#rows * this.#columns)
            .fill(0)
            .map(() => []);
    }

    public get min() {
        return this.#min;
    }

    public get max() {
        return this.#max;
    }

    public get cellSize() {
        return this.#cellSize;
    }

    public get rows() {
        return this.#rows;
    }

    public get columns() {
        return this.#columns;
    }

    public cellAt(coords: Vector2) {
        this.#assertInBounds(coords);
        return this.#safeCellAt(coords);
    }

    public nearbyCells(coords: Vector2, radius: number) {
        this.#assertInBounds(coords);
        const minCol = Math.max(
            0,
            Math.floor((coords.x - radius - this.#min.x) / this.#cellSize)
        );
        const maxCol = Math.min(
            this.#columns - 1,
            Math.floor((coords.x + radius - this.#min.x) / this.#cellSize)
        );
        const minRow = Math.max(
            0,
            Math.floor((coords.y - radius - this.#min.y) / this.#cellSize)
        );
        const maxRow = Math.min(
            this.#rows - 1,
            Math.floor((coords.y + radius - this.#min.y) / this.#cellSize)
        );
        const cells: number[] = new Array(
            (maxRow - minRow + 1) * (maxCol - minCol + 1)
        );
        let index = 0;
        for (let row = minRow; row <= maxRow; ++row) {
            for (let col = minCol; col <= maxCol; ++col) {
                cells[index++] = row * this.#columns + col;
            }
        }
        return cells;
    }

    public add(item: T, coords: Vector2, radius?: number) {
        this.#assertInBounds(coords);
        const id = ++this.#idCounter;
        if (radius == null) {
            const cellIndex = this.#safeCellAt(coords);
            this.#cells[cellIndex]!.push([id, item]);
            this.#idLookup.set(id, [[cellIndex]]);
            return id;
        }

        const minCol = Math.max(
            0,
            Math.floor(
                (coords.x - (radius ?? 0) - this.#min.x) / this.#cellSize
            )
        );
        const maxCol = Math.min(
            this.#columns - 1,
            Math.floor(
                (coords.x + (radius ?? 0) - this.#min.x) / this.#cellSize
            )
        );
        const minRow = Math.max(
            0,
            Math.floor(
                (coords.y - (radius ?? 0) - this.#min.y) / this.#cellSize
            )
        );
        const maxRow = Math.min(
            this.#rows - 1,
            Math.floor(
                (coords.y + (radius ?? 0) - this.#min.y) / this.#cellSize
            )
        );
        const cells: number[] = [];
        for (let row = minRow; row <= maxRow; ++row) {
            for (let col = minCol; col <= maxCol; ++col) {
                const cellIndex = row * this.#columns + col;
                cells.push(cellIndex);
                this.#cells[cellIndex]!.push([id, item, radius]);
            }
        }
        this.#idLookup.set(id, [cells]);
        return id;
    }

    public remove(id: number): boolean {
        const itemLookup = this.#idLookup.get(id);
        if (!itemLookup) {
            return false;
        }

        const [cells] = itemLookup;
        for (const cellIndex of cells) {
            const cellItems = this.#cells[cellIndex]!;
            const itemIndex = cellItems.findIndex(
                (cellItem) => cellItem[0] === id
            );
            if (itemIndex !== -1) {
                cellItems.splice(itemIndex, 1);
            }
        }
        return this.#idLookup.delete(id);
    }

    #safeCellAt(coords: Vector2): number {
        const col = Math.floor((coords.x - this.#min.x) / this.#cellSize);
        const row = Math.floor((coords.y - this.#min.y) / this.#cellSize);
        return row * this.#columns + col;
    }

    #assertInBounds(coords: Vector2): void {
        if (
            coords.x < this.#min.x ||
            coords.x >= this.#max.x ||
            coords.y < this.#min.y ||
            coords.y >= this.#max.y
        ) {
            throw new Error(
                `Coordinates (${coords.x}, ${coords.y}) are out of bounds for the grid.`
            );
        }
    }
}
