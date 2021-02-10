import { useRef, useEffect } from 'react';
import { useAsBind } from 'use-as-bind';

import './Board.css';

const BOARD_SIZE = 60 * 9;

// const useMyWasm = createAsBindHook('library.wasm', {
//   imports: {
//     consoleLog: (message) => {
//       console.log(message);
//     },
//   },
// });

const drawBoard = (ctx) => {
  ctx.save();

  // draw outer border
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.rect(0, 0, BOARD_SIZE, BOARD_SIZE);
  ctx.stroke();

  // draw groups of cells
  for(let i = 0; i < 2; i++) {
    for(let j = 0; j < 2; j++) {
      // draw outside border
      ctx.lineWidth = 4;
      for(let a = 0; a < 2; a++) {
        for(let b = 0; b < 2; b++) {
          // draw individual square
          ctx.lineWidth = 2;
        }
      }
    }
  }

  ctx.restore();
};

const Board = () => {
  const { loaded, instance, error } = useAsBind('library.wasm');
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);
    drawBoard(ctx);
  });

  return (
    <div className='Board'>
      <canvas
        className='Board-canvas'
        ref={canvasRef}
        width={BOARD_SIZE}
        height={BOARD_SIZE}
      />
      <div>
      {loaded && instance.exports.exampleFunction("hello", "world")}
      {error && error.message}
      </div>
    </div>
  );
};

export default Board;