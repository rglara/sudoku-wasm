import { useRef, useEffect } from 'react';

import './Board.css';

const CELL_SIZE = 90;
const PENCIL_CELL_SIZE = CELL_SIZE / 3;
const TILE_SIZE = CELL_SIZE * 3;
const BOARD_SIZE = TILE_SIZE * 3;
const SHADE_COLOR = '#F3E12E';
const PUZZLE_COLOR = 'black';
const PEN_COLOR = 'dodgerblue';
const PENCIL_COLOR = 'grey';

const drawSquare = (ctx, thickness, x, y, width, height) => {
	ctx.lineWidth = thickness;
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.stroke();
};

const shadeCell = (ctx, x, y) => {
	ctx.translate(x * CELL_SIZE, y * CELL_SIZE);
	ctx.fillStyle = SHADE_COLOR;
	ctx.fillRect(0, 0, CELL_SIZE, CELL_SIZE);
	ctx.translate(-x * CELL_SIZE, -y * CELL_SIZE);
};

const drawLargeValue = (ctx, color, x, y, num) => {
	ctx.translate(x * CELL_SIZE, (y * CELL_SIZE)+6);
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.font = '48px sans-serif';
	ctx.fillText(num, CELL_SIZE/2, CELL_SIZE/2);
	ctx.translate(-x * CELL_SIZE, (-y * CELL_SIZE)-6);
};

const drawStartingValue = (ctx, x, y, num) => {
	drawLargeValue(ctx, PUZZLE_COLOR, x, y, num);
};

const drawPenValue = (ctx, x, y, num) => {
	drawLargeValue(ctx, PEN_COLOR, x, y, num);
};

const drawPencilValues = (ctx, x, y, str) => {
	ctx.translate(x * CELL_SIZE, y * CELL_SIZE);
	ctx.strokeStyle = PENCIL_COLOR;
	ctx.fillStyle = PENCIL_COLOR;
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.font = '22px sans-serif';
	for(let i = 0; i < str.length; i++) {
		const num = parseInt(str[i]);
		const col = (num-1) % 3;
		const row = Math.floor((num-1)/3);
		ctx.fillText(
			num,
			(col * PENCIL_CELL_SIZE) + (PENCIL_CELL_SIZE/2),
			(row * PENCIL_CELL_SIZE) + (PENCIL_CELL_SIZE/2)
		);
	}
	ctx.translate(-x * CELL_SIZE, -y * CELL_SIZE);
};

const drawCell = (ctx, x, y) => {
	ctx.translate(x * CELL_SIZE, y * CELL_SIZE);
	drawSquare(ctx, 1, 0, 0, CELL_SIZE, CELL_SIZE);
	ctx.translate(-x * CELL_SIZE, -y * CELL_SIZE);
};

const drawTile = (ctx, x, y) => {
	ctx.translate(x * TILE_SIZE, y * TILE_SIZE);
	// draw outer border
	drawSquare(ctx, 4, 0, 0, TILE_SIZE, TILE_SIZE);
	for (let a = 0; a < 3; a++) {
		for (let b = 0; b < 3; b++) {
			drawCell(ctx, a, b);
		}
	}
	ctx.translate(-x * TILE_SIZE, -y * TILE_SIZE);
};

const drawBoard = ctx => {
	ctx.save();
	ctx.strokeStyle = PUZZLE_COLOR;
	// draw outer border
	drawSquare(ctx, 12, 0, 0, BOARD_SIZE, BOARD_SIZE);

	// draw tiles
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			drawTile(ctx, i, j);
		}
	}
	ctx.restore();
};

const drawCellDetails = (ctx, selectedCell, baseBoard, penMarks, pencilMarks) => {
	ctx.save();
	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			if ((selectedCell.x === x) && (selectedCell.y === y)) {
				shadeCell(ctx, x, y);
			}
			const arrayIndex = y*9+x;
			if (baseBoard && (baseBoard.length > 0)) {
				const num = parseInt(baseBoard.charAt(arrayIndex));
				if (num > 0) {
					drawStartingValue(ctx, x, y, num);
					continue;
				}
			}
			if (penMarks && (penMarks.length > 0)) {
				const num = parseInt(penMarks.charAt(arrayIndex));
				if (num > 0) {
					drawPenValue(ctx, x, y, num);
					continue;
				}
			}
			if (pencilMarks && (pencilMarks.length > 0)) {
				const str = pencilMarks.split('|')[arrayIndex];
				if (str) {
					drawPencilValues(ctx, x, y, str);
					continue;
				}
			}
		}
	}
	ctx.restore();
};

const Board = ({baseBoard, penMarks, pencilMarks,  selectedCell, onClick}) => {
	const canvasRef = useRef(null);

	const draw = ctx => {
		ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);
		drawCellDetails(
			ctx,
			selectedCell,
			baseBoard,
			penMarks,
			pencilMarks);
		drawBoard(ctx);
	};

	useEffect(() => {
		const canvasObj = canvasRef.current;
		const ctx = canvasObj.getContext('2d');
		draw(ctx);
	});

	const handleClick = evt => {
		const cellX = Math.floor((evt.pageX - evt.target.offsetLeft) / CELL_SIZE);
		const cellY = Math.floor((evt.pageY - evt.target.offsetTop) / CELL_SIZE);
		onClick(cellX, cellY);
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
