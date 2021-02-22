import { useState } from 'react';
import { AsBind } from 'as-bind';

import './Solver.css';

const wasm = fetch('library.wasm');

const Solver = ({onProgress, baseBoard}) => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState(null);
	const [instance, setInstance] = useState(null);

	const onUpdate = (message, cellX, cellY, val, isPen) => {
		onProgress({ message, cellX, cellY, val, isPen });
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

			localInstance.exports.solvePuzzle(baseBoard);
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
