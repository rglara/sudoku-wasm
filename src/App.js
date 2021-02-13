import { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPencilAlt, faPenFancy } from '@fortawesome/free-solid-svg-icons';
// import { useAsBind } from 'use-as-bind';

import './App.css';

import Board from './components/Board';
import Loader from './components/Loader';

// const useMyWasm = createAsBindHook('library.wasm', {
//   imports: {
//     consoleLog: (message) => {
//       console.log(message);
//     },
//   },
// });

const App = () => {
	// const { loaded, instance, error } = useAsBind('library.wasm');
	const [message, setMessage] = useState('');
	const [baseBoard, setBaseBoard] = useState([]);
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
		setMessage(`New board '${val.name}' loaded!`);
	};
  
	return (
		<div className='App'>
			<header className='App-header'>
				Sudoku Solver
			</header>
			<div className='App-body'>
				<Board
					baseBoard={baseBoard}
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
					<div className='App-message'>
						{message}
					</div>
				</div>
			</div>
		</div>
	);
};
//<div>
//{loaded && instance.exports.exampleFunction("hello", "world")}
//{error && error.message}
//</div>

export default App;
