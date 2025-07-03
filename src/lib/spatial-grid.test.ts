import { beforeEach, describe, expect, it, test } from 'bun:test';
import { SpatialGrid2D, type CreateSpatialGrid2DOptions } from './spatial-grid';

// A helper type for items stored in the grid for tests
type TestItem = { name: string };

describe('SpatialGrid2D', () => {
    describe('Constructor and Initialization', () => {
        test('should initialize with correct default values', () => {
            const grid = new SpatialGrid2D();

            const expectedWidth =
                SpatialGrid2D.DEFAULT_MAX_X - SpatialGrid2D.DEFAULT_MIN_X;
            const expectedHeight =
                SpatialGrid2D.DEFAULT_MAX_Y - SpatialGrid2D.DEFAULT_MIN_Y;
            const expectedCellSize = SpatialGrid2D.DEFAULT_CELL_SIZE;

            expect(grid.min).toEqual({ x: -4000, y: -4000 });
            expect(grid.max.x).toBe(4000);
            expect(grid.max.y).toBe(8000);
            expect(grid.cellSize).toBe(expectedCellSize);
            expect(grid.rows).toBe(
                Math.ceil(expectedHeight / expectedCellSize)
            );
            expect(grid.columns).toBe(
                Math.ceil(expectedWidth / expectedCellSize)
            );
        });

        test('should initialize with custom options', () => {
            const options = {
                min: { x: 0, y: 0 },
                max: { x: 100, y: 200 },
                cellSize: 10,
            } satisfies CreateSpatialGrid2DOptions;
            const grid = new SpatialGrid2D(options);

            expect(grid.min).toEqual(options.min);
            expect(grid.max).toEqual(options.max);
            expect(grid.cellSize).toBe(options.cellSize);
            expect(grid.rows).toBe(20);
            expect(grid.columns).toBe(10);
        });
    });

    describe('Core Methods', () => {
        let grid: SpatialGrid2D<TestItem>;

        beforeEach(() => {
            grid = new SpatialGrid2D<TestItem>({
                min: { x: 0, y: 0 },
                max: { x: 100, y: 100 },
                cellSize: 10,
            });
        });

        describe('construct', () => {
            it('should have correct values after construction', () => {
                expect(grid.min).toEqual({ x: 0, y: 0 });
                expect(grid.max).toEqual({ x: 100, y: 100 });
                expect(grid.cellSize).toBe(10);
                expect(grid.rows).toBe(10);
                expect(grid.columns).toBe(10);
            });
        });

        describe('cellAt', () => {
            it('should return the correct cell index for a given coordinate', () => {
                // Top-left corner
                expect(grid.cellAt({ x: 0, y: 0 })).toBe(0);
                // A point inside the first cell
                expect(grid.cellAt({ x: 5, y: 5 })).toBe(0);
                // A point that falls exactly on a boundary should be in the lower cell
                expect(grid.cellAt({ x: 10, y: 10 })).toBe(11); // row 1, col 1
                // A point in the middle
                expect(grid.cellAt({ x: 55, y: 25 })).toBe(25); // row 2, col 5
                // Bottom-right corner
                expect(grid.cellAt({ x: 99, y: 99 })).toBe(99);
                // Out of bounds
                expect(() => grid.cellAt({ x: 100, y: 100 })).toThrow();
            });

            it('should throw an error for out-of-bounds coordinates', () => {
                expect(() => grid.cellAt({ x: -1, y: 0 })).toThrow();
                expect(() => grid.cellAt({ x: 101, y: 50 })).toThrow();
                expect(() => grid.cellAt({ x: 50, y: -1 })).toThrow();
                expect(() => grid.cellAt({ x: 50, y: 101 })).toThrow();
            });
        });

        describe('add and remove', () => {
            it('should add an item without a radius and allow its removal', () => {
                const item = { name: 'player' };
                const coords = { x: 15, y: 15 };

                const id = grid.add(item, coords);
                expect(id).toBe(1);

                // Now remove it
                const wasRemoved = grid.remove(id);
                expect(wasRemoved).toBe(true);

                // Try to remove it again
                const wasRemovedAgain = grid.remove(id);
                expect(wasRemovedAgain).toBe(false);
            });

            it('should add an item with a radius and allow its removal', () => {
                const item = { name: 'explosion' };
                const coords = { x: 50, y: 50 };
                const radius = 15;

                const id = grid.add(item, coords, radius);
                expect(id).toBeGreaterThan(0);

                // Now remove it
                const wasRemoved = grid.remove(id);
                expect(wasRemoved).toBe(true);

                // Removing a non-existent ID should fail
                expect(grid.remove(999)).toBe(false);
            });

            it('should throw an error when adding an item out of bounds', () => {
                const item = { name: 'outlaw' };
                const coords = { x: -50, y: -50 };
                expect(() => grid.add(item, coords)).toThrow();
            });
        });

        describe('nearbyCells', () => {
            it('should return a single cell for a zero radius', () => {
                const coords = { x: 33, y: 44 };
                const nearby = [...grid.nearbyCells(coords, 0)];
                const expectedCell = grid.cellAt(coords); // cell 43

                expect(nearby).toHaveLength(1);
                expect(nearby[0]).toBe(expectedCell);
            });

            it('should return the correct cells for a query in the middle of the grid', () => {
                const coords = { x: 55, y: 55 }; // Center of cell 55
                const radius = 10; // Should touch cells in a 3x3 square around it
                const nearby = [...grid.nearbyCells(coords, radius)];

                // Expected cells: rows 4,5,6 and cols 4,5,6
                const expectedCells = [44, 45, 46, 54, 55, 56, 64, 65, 66];

                expect(nearby).toHaveLength(9);
                expect(nearby.sort()).toEqual(expectedCells.sort());
            });

            it('should correctly clamp the search area at the grid boundaries', () => {
                const coords = { x: 5, y: 5 }; // Center of cell 0
                const radius = 10;
                const nearby = [...grid.nearbyCells(coords, radius)];

                // Expected cells: a 2x2 square in the top-left
                const expectedCells = [0, 1, 10, 11];

                expect(nearby).toHaveLength(4);
                expect(nearby.sort()).toEqual(expectedCells.sort());
            });

            it('should throw an error for out-of-bounds coordinates', () => {
                expect(() => grid.nearbyCells({ x: -1, y: 0 }, 10)).toThrow();
            });
        });
    });
});
