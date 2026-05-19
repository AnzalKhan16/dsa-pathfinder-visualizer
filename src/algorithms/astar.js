export function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const openSet = [];
  
  for (const row of grid) {
    for (const node of row) {
      node.g = Infinity;
      node.f = Infinity;
      node.previousNode = null;
    }
  }

  startNode.g = 0;
  startNode.f = heuristic(startNode, finishNode);
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const currentNode = openSet.shift();

    if (currentNode.isWall) continue;
    if (currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;
      
      const tentativeG = currentNode.g + 1;
      if (tentativeG < neighbor.g) {
        neighbor.previousNode = currentNode;
        neighbor.g = tentativeG;
        neighbor.f = neighbor.g + heuristic(neighbor, finishNode);
        
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
}

function heuristic(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}
