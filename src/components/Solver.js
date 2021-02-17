import { useState } from 'react';
import { AsBind } from 'as-bind';

import './Solver.css';

const wasm = fetch('library.wasm');

const Solver = props => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState(null);
	const [instance, setInstance] = useState(null);

	const onUpdate = evt => {
		props.onUpdate(evt);
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

			// Should call consoleLog, and log: "Hello from AS!"
			localInstance.exports.exampleFunction('hello', 'world');
			await new Promise(resolve => setTimeout(resolve, 2000));
			localInstance.exports.exampleFunction('and', 'again');
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
