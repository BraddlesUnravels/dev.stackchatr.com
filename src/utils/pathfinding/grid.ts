import type { Coord, Grid, GridNode } from './types';

export interface GridConfig {
  rowCount: number;
  colCount: number;
  start: Coord;
  finish: Coord;
}

export function createGrid(config: GridConfig): Grid {
  const { rowCount, colCount, start, finish } = config;
  const grid: Grid = [];
  for (let row = 0; row < rowCount; row++) {
    const currentRow: GridNode[] = [];
    for (let col = 0; col < colCount; col++) {
      currentRow.push(createNode({ row, col }, start, finish));
    }
    grid.push(currentRow);
  }
  return grid;
}

export function createNode(coord: Coord, start: Coord, finish: Coord): GridNode {
  const { row, col } = coord;
  const isStart = row === start.row && col === start.col;
  const isFinish = row === finish.row && col === finish.col;

  return {
    row,
    col,
    isStart,
    isFinish,
    distance: Infinity,
    distanceToFinishNode: Math.abs(finish.row - row) + Math.abs(finish.col - col),
    isVisited: false,
    isWall: false,
    previousNode: null,
    isNode: true,
    isInShortestPath: false
  };
}

/** Toggle a wall at the given coord, respecting start/finish semantics. */
export function toggleWall(grid: Grid, row: number, col: number): Grid {
  const newGrid = grid.map((r) => r.slice());
  const node = newGrid[row][col];
  if (!node.isStart && !node.isFinish && node.isNode) {
    newGrid[row][col] = { ...node, isWall: !node.isWall };
  }
  return newGrid;
}

/** Reset all transient state (visited, distances, previous, shortest-path flags) but keep walls & start/finish. */
export function resetGridState(grid: Grid, finish: Coord): Grid {
  const newGrid: Grid = grid.map((row) =>
    row.map((node) => {
      const isFinish = node.row === finish.row && node.col === finish.col;
      return {
        ...node,
        isVisited: false,
        distance: Infinity,
        distanceToFinishNode: isFinish
          ? 0
          : Math.abs(finish.row - node.row) + Math.abs(finish.col - node.col),
        previousNode: null,
        isInShortestPath: false
      };
    })
  );

  return newGrid;
}

export function clearWalls(grid: Grid): Grid {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      isWall: false
    }))
  );
}

export function gridHasVisitedOrPath(grid: Grid): boolean {
  for (const row of grid) {
    for (const node of row) {
      if (node.isVisited || node.isInShortestPath) return true;
    }
  }
  return false;
}
