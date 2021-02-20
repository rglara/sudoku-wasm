import { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPencilAlt, faPenFancy } from '@fortawesome/free-solid-svg-icons';

import './App.css';

import Board from './components/Board';
import Loader from './components/Loader';
import Solver from './components/Solver';

const App = () => {
	const [message, setMessage] = useState('');
	const [baseBoard, setBaseBoard] = useState(new Array(81));
	const [penMarks, setPenMarks] = useState(new Array(81));
	const [pencilMarks, setPencilMarks] = useState(new Array(81));
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
		setBaseBoard(val.grid);
		setPencilMarks(new Array(81));
		setPenMarks(new Array(81));
		setMessage(`New board '${val.name}' loaded!`);
	};

	const setPencilMark = (x, y, val) => {
		const localMarks = pencilMarks;
		localMarks[y*9+x] = val;
		setPencilMarks(localMarks);
	};
	const setPenMark = (x, y, val) => {
		const localMarks = penMarks;
		localMarks[y*9+x] = val;
		setPenMarks(localMarks);
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
					<Solver onUpdate={handleSolverUpdate} baseBoard={baseBoard} />
					<div className='App-message'>
						{message}
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
