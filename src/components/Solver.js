import { useState, useEffect } from 'react';

import './Solver.css';

const libWorker = new Worker('./workers/solver.js');

const Solver = ({onProgress, baseBoard}) => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		libWorker.onmessage = evt => {
			if (evt && evt.data && evt.data.type) {
				if (evt.data.type === 'progress') {
					onProgress(evt.data.progress);
				} else if (evt.data.type === 'status') {
					onProgress( { message: evt.data.message });
				} else if (evt.data.type === 'done') {
					if (evt.data.error) {
						setError(evt.data.error);
					} else {
						onProgress( { message: 'Processing Complete!'})
					}
					setIsProcessing(false);
				}
			}
		};
	});

	const runSolver = () => {
		libWorker.postMessage({ type: 'goSolve', baseBoard });
	}

	const handleButtonClick = async () => {
		setError(null);
		setIsProcessing(true);
		runSolver();
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
