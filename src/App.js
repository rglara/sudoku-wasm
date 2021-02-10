import './App.css';

import Board from './components/Board';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        Sudoku Solver
      </header>
      <Board />
    </div>
  );
};

export default App;
