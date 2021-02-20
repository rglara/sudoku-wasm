import { useState } from 'react';
import { AsBind } from 'as-bind';

import './Solver.css';

const wasm = fetch('library.wasm');

const Solver = props => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState(null);
	const [instance, setInstance] = useState(null);

	const onUpdate = (message, cellX, cellY, val, isPen) => {
		props.onUpdate({ message, cellX, cellY, val, isPen });
	};
	const runSolver = async () => {
		try {
			let localInstance = null;
			if (!instance) {
				localInstance = await AsBind.instantiate(wasm, {
					index: { onUpdate }
				});
				setInstance(localInstance);
			} else {
				localInstance = instance;
			}

			let puzzleStr = '';
			for (let i = 0; i < props.baseBoard.length; i += 1) {
				const cellValue = props.baseBoard[i];
				if (cellValue) {
					puzzleStr += cellValue.toString();
				} else {
					puzzleStr += '0';
				}
			}

			localInstance.exports.solvePuzzle(puzzleStr);
		}
		catch(err) {
			setError(err);
		}
	};
	const handleButtonClick = async () => {
		setError(null);
		setIsProcessing(true);
		await runSolver();
		setIsProcessing(false);
	};

	return (
		<div className='Solver'>
			<div>
				<button
					onClick={handleButtonClick}
					disabled={isProcessing}
				>
					Run Solver
				</button>
			</div>
			<div>
				{error && error.message}
			</div>
		</div>
	);
};

export default Solver;
