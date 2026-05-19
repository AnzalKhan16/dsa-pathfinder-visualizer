export function recursiveDivisionMaze(grid, startNode, finishNode) {
  const wallsToAnimate = [];
  const rows = grid.length;
  const cols = grid[0].length;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        if (!grid[r][c].isStart && !grid[r][c].isFinish) {
          grid[r][c].isWall = true;
          wallsToAnimate.push(grid[r][c]);
        }
      }
    }
  }

  divide(1, rows - 2, 1, cols - 2, chooseOrientation(rows - 2, cols - 2), grid, wallsToAnimate);

  return wallsToAnimate;
}

function divide(rowStart, rowEnd, colStart, colEnd, orientation, grid, wallsToAnimate) {
  if (rowEnd < rowStart || colEnd < colStart) return;

  const horizontal = orientation === 'horizontal';

  if (horizontal) {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    
    if (possibleRows.length === 0 || possibleCols.length === 0) return;

    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];

    for (let c = colStart - 1; c <= colEnd + 1; c++) {
      if (c === colRandom || grid[currentRow][c].isStart || grid[currentRow][c].isFinish) continue;
      
      const node = grid[currentRow][c];
      if (!node.isWall) {
        node.isWall = true;
        wallsToAnimate.push(node);
      }
    }

    divide(rowStart, currentRow - 2, colStart, colEnd, chooseOrientation(currentRow - 2 - rowStart + 1, colEnd - colStart + 1), grid, wallsToAnimate);
    divide(currentRow + 2, rowEnd, colStart, colEnd, chooseOrientation(rowEnd - currentRow - 2 + 1, colEnd - colStart + 1), grid, wallsToAnimate);

  } else {
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }

    if (possibleRows.length === 0 || possibleCols.length === 0) return;

    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];

    for (let r = rowStart - 1; r <= rowEnd + 1; r++) {
      if (r === rowRandom || grid[r][currentCol].isStart || grid[r][currentCol].isFinish) continue;
      
      const node = grid[r][currentCol];
      if (!node.isWall) {
        node.isWall = true;
        wallsToAnimate.push(node);
      }
    }

    divide(rowStart, rowEnd, colStart, currentCol - 2, chooseOrientation(rowEnd - rowStart + 1, currentCol - 2 - colStart + 1), grid, wallsToAnimate);
    divide(rowStart, rowEnd, currentCol + 2, colEnd, chooseOrientation(rowEnd - rowStart + 1, colEnd - currentCol - 2 + 1), grid, wallsToAnimate);
  }
}

function chooseOrientation(height, width) {
  if (width < height) {
    return 'horizontal';
  } else if (height < width) {
    return 'vertical';
  } else {
    return Math.random() < 0.5 ? 'horizontal' : 'vertical';
  }
}
