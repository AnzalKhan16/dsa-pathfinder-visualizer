export const GRID_ROWS = 21;
export const GRID_COLS = 51;

export const START_NODE_ROW = 10;
export const START_NODE_COL = 10;
export const FINISH_NODE_ROW = 10;
export const FINISH_NODE_COL = 40;

export const NODE_TYPES = {
  EMPTY: 'EMPTY',
  WALL: 'WALL',
  START: 'START',
  FINISH: 'FINISH',
  VISITED: 'VISITED',
  PATH: 'PATH'
};

export const ALGORITHMS = {
  DIJKSTRA: 'Dijkstra',
  ASTAR: 'A* Search',
  BFS: 'Breadth-First Search',
  DFS: 'Depth-First Search'
};

export const MAZES = {
  RECURSIVE_DIVISION: 'Recursive Division',
  RANDOM: 'Randomized Wall'
};

export const SPEEDS = {
  FAST: 10,
  MEDIUM: 30,
  SLOW: 100
};
