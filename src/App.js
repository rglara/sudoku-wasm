import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPenFancy } from '@fortawesome/free-solid-svg-icons';

import './App.css';

import Board from './components/Board';
import Loader from './components/Loader';
import Solver from './components/Solver';

const App = () => {
	const [message, setMessage] = useState('');
	const [baseBoard, setBaseBoard] = useState('0'.repeat(81));
	const [penMarks, setPenMarks] = useState('0'.repeat(81));
	const [pencilMarks, setPencilMarks] = useState('|'.repeat(80));
	const [selectedCell, setSelectedCell] = useState({ x: -1, y: -1 });
	const [isPenMode, setIsPenMode] = useState(true);
	const mainRef = useRef(null);

	const handleBoardClick = (cellX, cellY) => {
		setSelectedCell({ x: cellX, y: cellY })
		setMessage(`Cell clicked: (${cellX}, ${cellY})`);
	};

	const handleEditModeClick = () => {
		setIsPenMode(!isPenMode);
		setMessage(`Now in ${isPenMode ? 'Pencil' : 'Pen'} mode`);
		mainRef.current.focus();
	};

	const handleLoaderLoad = val => {
		// convert base board array to string
		const bbStr = val.grid.map(num => num.toString()).join('');
		setBaseBoard(bbStr);
		setPencilMarks('|'.repeat(80));
		setPenMarks('0'.repeat(81));
		setMessage(`New board '${val.name}' loaded!`);
	};

	const setPencilMark = (x, y, val, doToggle) => {
		setPencilMarks(currentMarks => {
			const array = currentMarks.split('|');
			const index = y*9+x;
			let newValue = val;
			if (doToggle) {
				const currentValue = array[index];
				if (currentValue.indexOf(val) < 0) {
					newValue = currentValue + val;
				} else {
					newValue = currentValue.replace(val, '');
				}
			}
			array[index] = newValue;
			return array.join('|');
		});
	};

	const setPenMark = (x, y, val) => {
		setPenMarks(currentMarks => {
			const index = y*9+x;
			return currentMarks.slice(0, index) + val + currentMarks.slice(index + 1)
		});
	};

	const handleSolverUpdate = evt => {
		if ((evt.cellX >= 0) && (evt.cellX < 9) && (evt.cellY >= 0) && (evt.cellY < 9)) {
			if (evt.isPen) {
				setPenMark(evt.cellX, evt.cellY, evt.val);
			} else {
				setPencilMark(evt.cellX, evt.cellY, evt.val);
			}
		}
		setSelectedCell({ x: -1, y: -1 });
		setMessage(evt.message);
	};

	const handleKeyPress = evt => {
		if (evt.key) {
			if (evt.key >= '1' && evt.key <= '9') {
				setMessage(`Toggle ${evt.key} in ${isPenMode ? 'pen': 'pencil'}`);
				if (isPenMode) {
					setPenMark(selectedCell.x, selectedCell.y, evt.key);
				} else {
					setPencilMark(selectedCell.x, selectedCell.y, evt.key, true);
				}
			} else if (evt.key === 's') {
				handleEditModeClick();
			} else if (evt.key === 'x') {
				setPenMark(selectedCell.x, selectedCell.y, '0');
				setPencilMark(selectedCell.x, selectedCell.y, '');
			} else if (evt.key === 'ArrowUp') {
				setSelectedCell(currentCell => {
					let newY = currentCell.y - 1;
					if (newY < 0) { newY = 0; }
					return { x: currentCell.x, y: newY };
				});
			} else if (evt.key === 'ArrowDown') {
				setSelectedCell(currentCell => {
					let newY = currentCell.y + 1;
					if (newY > 8) { newY = 8; }
					return { x: currentCell.x, y: newY };
				});
			} else if (evt.key === 'ArrowLeft') {
				setSelectedCell(currentCell => {
					let newX = currentCell.x - 1;
					if (newX < 0) { newX = 0; }
					return { x: newX, y: currentCell.y };
				});
			} else if (evt.key === 'ArrowRight') {
				setSelectedCell(currentCell => {
					let newX = currentCell.x + 1;
					if (newX > 8) { newX = 8; }
					return { x: newX, y: currentCell.y };
				});
			}
		}
	};

	return (
		<div
			className='App'
			tabIndex={0}
			onKeyUp={handleKeyPress}
			ref={mainRef}
		>
			<header className='App-header'>
				Sudoku Solver
			</header>
			<div className='App-body'>
				<Board
					baseBoard={baseBoard}
					penMarks={penMarks}
					pencilMarks={pencilMarks}
					selectedCell={selectedCell}
					onClick={handleBoardClick}
				/>
				<div className='App-controls'>
					<div className='App-edit-mode'>
						{ isPenMode &&
						<button onClick={handleEditModeClick}><FontAwesomeIcon icon={faPencilAlt} size='4x' /></button>
						}
						{ !isPenMode &&
						<div className='App-selected-mode'>
							<FontAwesomeIcon icon={faPencilAlt} size='3x' />
						</div>
						}
						{ isPenMode &&
						<div className='App-selected-mode'>
							<FontAwesomeIcon icon={faPenFancy} size='3x' />
						</div>
						}
						{ !isPenMode &&
						<button onClick={handleEditModeClick}><FontAwesomeIcon icon={faPenFancy} size='4x' /></button>
						}
					</div>
					<Loader onLoad={handleLoaderLoad} />
					<Solver onProgress={handleSolverUpdate} baseBoard={baseBoard} />
					<div className='App-message'>
						{message}
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
