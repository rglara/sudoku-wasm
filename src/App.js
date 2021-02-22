import { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPencilAlt, faPenFancy } from '@fortawesome/free-solid-svg-icons';

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
	// const [isPenMode, setIsPenMode] = useState(true);

	const handleBoardClick = (cellX, cellY) => {
		setSelectedCell({ x: cellX, y: cellY })
		setMessage(`Cell clicked: (${cellX}, ${cellY})`);
	};

	// const handleEditModeClick = () => {
	// 	setIsPenMode(!isPenMode);
	// 	setMessage(`Now in ${isPenMode ? 'Pencil' : 'Pen'} mode`);
	// };

	const handleLoaderLoad = val => {
		// convert base board array to string
		const bbStr = val.grid.map(num => num.toString()).join('');
		setBaseBoard(bbStr);
		setPencilMarks('|'.repeat(80));
		setPenMarks('0'.repeat(81));
		setMessage(`New board '${val.name}' loaded!`);
	};

	const setPencilMark = (x, y, val) => {
		setPencilMarks(currentMarks => {
			const array = currentMarks.split('|');
			array[y*9+x] = val;
			return array.join('|');
		});
	};
	const setPenMark = (x, y, val) => {
		const index = y*9+x;
		setPenMarks(currentMarks => {
			return currentMarks.slice(0, index) + val + currentMarks.slice(index + 1);
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

	// const handleKeyPress = evt => {
	// 	setMessage(evt.key);
	// };

	return (
		<div
			className='App'
			// tabIndex={0}
			// onKeyPress={handleKeyPress}
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
					{/* <div className='App-edit-mode'>
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
					</div> */}
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
