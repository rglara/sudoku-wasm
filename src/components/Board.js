import { useRef, useEffect } from 'react';

import './Board.css';

const CELL_SIZE = 60;
const TILE_SIZE = CELL_SIZE * 3;
const BOARD_SIZE = TILE_SIZE * 3;

const drawSquare = (ctx, thickness, x, y, width, height) => {
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.stroke();
};

const drawCell = (ctx, x, y) => {
  ctx.translate(x * CELL_SIZE, y * CELL_SIZE);
  // draw outer border
  drawSquare(ctx, 1, 0, 0, CELL_SIZE, CELL_SIZE);
  ctx.translate(-x * CELL_SIZE, -y * CELL_SIZE);
};

const drawTile = (ctx, x, y) => {
  ctx.translate(x * TILE_SIZE, y * TILE_SIZE);
  // draw outer border
  drawSquare(ctx, 4, 0, 0, TILE_SIZE, TILE_SIZE);
  for(let a = 0; a < 3; a++) {
    for(let b = 0; b < 3; b++) {
      drawCell(ctx, a, b);
    }
  }
  ctx.translate(-x * TILE_SIZE, -y * TILE_SIZE);
};

const drawBoard = ctx => {
  // draw outer border
  drawSquare(ctx, 12, 0, 0, BOARD_SIZE, BOARD_SIZE);

  // draw tiles
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      drawTile(ctx, i, j);
    }
  }
};

const Board = (props) => {
  const canvasRef = useRef(null);
  const canvasOrigin = { x: 0, y: 0 };
  useEffect(() => {
    const canvasObj = canvasRef.current;
    canvasOrigin.x = canvasObj.offsetLeft;
    canvasOrigin.y = canvasObj.offsetTop;
    const ctx = canvasObj.getContext('2d');
    ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);
    drawBoard(ctx);
  });

  const handleClick = (evt) => {
    const cellX = Math.floor((evt.pageX - canvasOrigin.x) / CELL_SIZE);
    const cellY = Math.floor((evt.pageY - canvasOrigin.y) / CELL_SIZE);
    props.onClick(cellX, cellY);
  };

  return (
    <div className='Board'>
      <canvas
        className='Board-canvas'
        ref={canvasRef}
        width={BOARD_SIZE}
        height={BOARD_SIZE}
        onClick={handleClick}
      />
    </div>
  );
};

export default Board;