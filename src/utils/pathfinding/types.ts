export type Coord = {
  row: number;
  col: number;
};

export type GridNode = Coord & {
  isStart: boolean;
  isFinish: boolean;
  distance: number;
  /** Heuristic distance to finish, used by A* */
  distanceToFinishNode: number;
  isVisited: boolean;
  isWall: boolean;
  previousNode: GridNode | null;
  /** Marker used in the original code to avoid toggling walls on start/finish */
  isNode: boolean;
  /** Derived/render-only flags */
  isInShortestPath?: boolean;
};

export type Grid = GridNode[][];

export type AlgorithmName = 'Dijkstra' | 'AStar' | 'BFS' | 'DFS';
