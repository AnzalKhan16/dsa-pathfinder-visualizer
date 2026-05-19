import React, { useState, useEffect } from 'react';
import Node from './components/Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from './algorithms/dijkstra';
import { astar } from './algorithms/astar';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import { recursiveDivisionMaze } from './algorithms/recursiveDivision';
import './App.css';

const GRID_ROWS = 20;
const GRID_COLS = 50;

const INITIAL_START_ROW = 10;
const INITIAL_START_COL = 10;
const INITIAL_FINISH_ROW = 10;
const INITIAL_FINISH_COL = 40;

const createNode = (col, row, startNode, finishNode) => {
  return {
    col,
    row,
    isStart: row === startNode.row && col === startNode.col,
    isFinish: row === finishNode.row && col === finishNode.col,
    isWall: false,
    isVisited: false,
    isPath: false,
    distance: Infinity,
    previousNode: null,
  };
};

const getInitialGrid = (startNode, finishNode) => {
  const grid = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < GRID_COLS; col++) {
      currentRow.push(createNode(col, row, startNode, finishNode));
    }
    grid.push(currentRow);
  }
  return grid;
};

function App() {
  const [grid, setGrid] = useState([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [interactionMode, setInteractionMode] = useState('none');
  const [startNode, setStartNode] = useState({ row: INITIAL_START_ROW, col: INITIAL_START_COL });
  const [finishNode, setFinishNode] = useState({ row: INITIAL_FINISH_ROW, col: INITIAL_FINISH_COL });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(10);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra');

  useEffect(() => {
    setGrid(getInitialGrid(startNode, finishNode));
  }, []);

  const handleMouseDown = (row, col) => {
    if (!grid.length || isAnimating) return;
    const node = grid[row][col];
    let mode = 'none';

    if (node.isStart) {
      mode = 'moveStart';
    } else if (node.isFinish) {
      mode = 'moveEnd';
    } else if (node.isWall) {
      mode = 'eraseWall';
    } else {
      mode = 'drawWall';
    }

    setInteractionMode(mode);
    setIsMousePressed(true);

    if (mode === 'drawWall' || mode === 'eraseWall') {
      setGrid((prevGrid) => getNewGridWithWallToggled(prevGrid, row, col, mode === 'drawWall'));
    }
  };

  const handleMouseEnter = (row, col) => {
    if (!isMousePressed || isAnimating) return;

    if (interactionMode === 'drawWall' || interactionMode === 'eraseWall') {
      const node = grid[row][col];
      if (node.isStart || node.isFinish) return;
      setGrid((prevGrid) => getNewGridWithWallToggled(prevGrid, row, col, interactionMode === 'drawWall'));
    } else if (interactionMode === 'moveStart') {
      const node = grid[row][col];
      if (node.isFinish) return;

      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[startNode.row] = [...newGrid[startNode.row]];
        newGrid[startNode.row][startNode.col] = { ...newGrid[startNode.row][startNode.col], isStart: false };
        
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = { ...newGrid[row][col], isStart: true, isWall: false };
        return newGrid;
      });
      setStartNode({ row, col });
    } else if (interactionMode === 'moveEnd') {
      const node = grid[row][col];
      if (node.isStart) return;

      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[finishNode.row] = [...newGrid[finishNode.row]];
        newGrid[finishNode.row][finishNode.col] = { ...newGrid[finishNode.row][finishNode.col], isFinish: false };
        
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = { ...newGrid[row][col], isFinish: true, isWall: false };
        return newGrid;
      });
      setFinishNode({ row, col });
    }
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
    setInteractionMode('none');
  };

  const clearGrid = () => {
    if (isAnimating) return;
    setGrid(getInitialGrid(startNode, finishNode));
    resetDOMClasses(getInitialGrid(startNode, finishNode));
  };

  const clearPath = () => {
    if (isAnimating) return;
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) =>
        row.map((node) => ({
          ...node,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          previousNode: null,
        }))
      );
      resetDOMClasses(newGrid);
      return newGrid;
    });
  };

  const resetDOMClasses = (currentGrid) => {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const domNode = document.getElementById(`node-${row}-${col}`);
        if (domNode) {
          const nodeState = currentGrid[row][col];
          let baseClass = 'node';
          if (nodeState.isStart) baseClass += ' node-start';
          if (nodeState.isFinish) baseClass += ' node-finish';
          if (nodeState.isWall) baseClass += ' node-wall';
          domNode.className = baseClass;
        }
      }
    }
  };

  const syncGridStateWithDOM = (visitedNodes, pathNodes) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => row.map(node => ({...node})));
      for (const node of visitedNodes) {
        newGrid[node.row][node.col].isVisited = true;
      }
      for (const node of pathNodes) {
        if (!newGrid[node.row][node.col].isStart && !newGrid[node.row][node.col].isFinish) {
          newGrid[node.row][node.col].isPath = true;
        }
      }
      return newGrid;
    });
  };

  const animateExploration = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder, visitedNodesInOrder);
        }, animationSpeed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isFinish) {
          const domNode = document.getElementById(`node-${node.row}-${node.col}`);
          if (domNode) domNode.className = 'node node-visited';
        }
      }, animationSpeed * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder, visitedNodesInOrder) => {
    if (nodesInShortestPathOrder.length <= 1 || nodesInShortestPathOrder[0].row !== startNode.row || nodesInShortestPathOrder[0].col !== startNode.col) {
      setIsAnimating(false);
      syncGridStateWithDOM(visitedNodesInOrder, []);
      return;
    }

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isFinish) {
          const domNode = document.getElementById(`node-${node.row}-${node.col}`);
          if (domNode) domNode.className = 'node node-path';
        }
        if (i === nodesInShortestPathOrder.length - 1) {
          setIsAnimating(false);
          syncGridStateWithDOM(visitedNodesInOrder, nodesInShortestPathOrder);
        }
      }, (animationSpeed * 3) * i);
    }
  };

  const visualizeAlgorithm = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const cleanGrid = grid.map(row => 
      row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null,
      }))
    );

    resetDOMClasses(cleanGrid);
    setGrid(cleanGrid);

    const startNodeObj = cleanGrid[startNode.row][startNode.col];
    const finishNodeObj = cleanGrid[finishNode.row][finishNode.col];

    let visitedNodesInOrder = [];
    if (selectedAlgorithm === 'dijkstra') {
      visitedNodesInOrder = dijkstra(cleanGrid, startNodeObj, finishNodeObj);
    } else if (selectedAlgorithm === 'astar') {
      visitedNodesInOrder = astar(cleanGrid, startNodeObj, finishNodeObj);
    } else if (selectedAlgorithm === 'bfs') {
      visitedNodesInOrder = bfs(cleanGrid, startNodeObj, finishNodeObj);
    } else if (selectedAlgorithm === 'dfs') {
      visitedNodesInOrder = dfs(cleanGrid, startNodeObj, finishNodeObj);
    }

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNodeObj);

    animateExploration(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const generateMaze = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Clear everything first
    const cleanGrid = getInitialGrid(startNode, finishNode);
    resetDOMClasses(cleanGrid);
    setGrid(cleanGrid);

    const startNodeObj = cleanGrid[startNode.row][startNode.col];
    const finishNodeObj = cleanGrid[finishNode.row][finishNode.col];

    const wallsToAnimate = recursiveDivisionMaze(cleanGrid, startNodeObj, finishNodeObj);

    animateMaze(wallsToAnimate, cleanGrid);
  };

  const animateMaze = (wallsToAnimate, cleanGrid) => {
    for (let i = 0; i <= wallsToAnimate.length; i++) {
      if (i === wallsToAnimate.length) {
        setTimeout(() => {
          setIsAnimating(false);
          syncGridStateWithMaze(wallsToAnimate, cleanGrid);
        }, animationSpeed * i);
        return;
      }
      setTimeout(() => {
        const node = wallsToAnimate[i];
        if (!node.isStart && !node.isFinish) {
          const domNode = document.getElementById(`node-${node.row}-${node.col}`);
          if (domNode) {
            domNode.className = 'node node-wall';
          }
        }
      }, animationSpeed * i);
    }
  };

  const syncGridStateWithMaze = (walls, currentGrid) => {
    setGrid(() => {
      const newGrid = currentGrid.map(row => row.map(node => ({...node})));
      for (const wall of walls) {
        newGrid[wall.row][wall.col].isWall = true;
      }
      return newGrid;
    });
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">Pathfinding Visualizer</div>
        <div className="speed-control">
          <label htmlFor="speed-slider">Speed: {animationSpeed}ms</label>
          <input 
            type="range" 
            id="speed-slider" 
            min="1" 
            max="50" 
            value={animationSpeed} 
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            disabled={isAnimating}
          />
        </div>
        <div className="algorithm-selector">
          <select 
            value={selectedAlgorithm} 
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isAnimating}
          >
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="astar">A* Search</option>
            <option value="bfs">Breadth-First Search</option>
            <option value="dfs">Depth-First Search</option>
          </select>
        </div>
        <div className="navbar-actions">
          <button className="nav-button" onClick={generateMaze} disabled={isAnimating}>Generate Maze</button>
          <button className="nav-button" onClick={clearGrid} disabled={isAnimating}>Clear Grid</button>
          <button className="nav-button" onClick={clearPath} disabled={isAnimating}>Clear Path</button>
          <button className="visualize-button" onClick={visualizeAlgorithm} disabled={isAnimating}>Visualize</button>
        </div>
      </nav>
      <main className="grid-container" onMouseLeave={handleMouseUp} onMouseUp={handleMouseUp}>
        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="grid-row">
              {row.map((node, colIdx) => (
                <Node
                  key={`${rowIdx}-${colIdx}`}
                  col={node.col}
                  row={node.row}
                  isFinish={node.isFinish}
                  isStart={node.isStart}
                  isWall={node.isWall}
                  isVisited={node.isVisited}
                  isPath={node.isPath}
                  onMouseDown={(r, c) => handleMouseDown(r, c)}
                  onMouseEnter={(r, c) => handleMouseEnter(r, c)}
                  onMouseUp={() => handleMouseUp()}
                />
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const getNewGridWithWallToggled = (grid, row, col, isWall) => {
  const newGrid = [...grid];
  newGrid[row] = [...newGrid[row]];
  const node = newGrid[row][col];
  newGrid[row][col] = {
    ...node,
    isWall: isWall,
  };
  return newGrid;
};

export default App;
