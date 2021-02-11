import { useState } from 'react';
// import { useAsBind } from 'use-as-bind';

import './App.css';

import Board from './components/Board';

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
  const [selectedCell, setSelectedCell] = useState(null);

  const handleBoardClick = (cellX, cellY) => {
    setMessage(`Cell clicked: (${cellX}, ${cellY})`);
  };
  
  return (
    <div className='App'>
      <header className='App-header'>
        Sudoku Solver
      </header>
      <div className='App-body'>
        <Board selectedCell={selectedCell} onClick={handleBoardClick}/>
        <div className='App-controls'>
          {message}
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
