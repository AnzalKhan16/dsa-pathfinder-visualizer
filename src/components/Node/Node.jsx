import React from 'react';
import './Node.css';

const Node = React.memo(({
  col,
  row,
  isFinish,
  isStart,
  isWall,
  isVisited,
  isPath,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const extraClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall
    ? 'node-wall'
    : isPath
    ? 'node-path'
    : isVisited
    ? 'node-visited'
    : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      onDragStart={(e) => e.preventDefault()}
    ></div>
  );
});

export default Node;
