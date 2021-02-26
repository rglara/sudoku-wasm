const onUpdate = (cellX, cellY, value, isPen) => {
	let val = '';
	if (isPen) {
		val = value;
	} else {
		val += value & 1 ? '1' : '';
		val += value & 2 ? '2' : '';
		val += value & 4 ? '3' : '';
		val += value & 8 ? '4' : '';
		val += value & 16 ? '5' : '';
		val += value & 32 ? '6' : '';
		val += value & 64 ? '7' : '';
		val += value & 128 ? '8' : '';
		val += value & 256 ? '9' : '';
	}
	self.postMessage({
		type: 'progress',
		progress: {
			message: `${isPen ? 'pen' : 'pencil'} (${cellX}, ${cellY})`,
			cellX,
			cellY,
			val,
			isPen,
		}
	});
};

let solverInstance;
const createSolver = () =>
	WebAssembly.instantiateStreaming(
		fetch('../solverlib.wasm'),
		{ env: { abort: () => {} }, Date: { now: Date.now }, solverlib: { onUpdate } });

const SolvePuzzleAsync = async (puzzleStr, delay) => {
	try {
		if (!solverInstance) {
			const obj = await createSolver();
			solverInstance = obj.instance;
		}

		// importing assemblyscript loader in web worker was being dumb, so this is here
		// pulled from @assemblyscript/loader
		const marshalString = str => {
			const length = str.length;
			const ptr = solverInstance.exports.__new(length << 1, 1);
			const U16 = new Uint16Array(solverInstance.exports.memory.buffer);
			for (let i = 0, p = ptr >>> 1; i < length; ++i) U16[p + i] = str.charCodeAt(i);
			return ptr;
		};
		solverInstance.exports.solvePuzzle(marshalString(puzzleStr), delay);
		self.postMessage({ type: 'done' });
	}
	catch(err) {
		self.postMessage({ type: 'done', error: err });
	}
};

const solvePuzzle = async (puzzleStr, delay) => {
	try {
		self.postMessage({ type: 'status', message: 'Loading library...' });
		await SolvePuzzleAsync(puzzleStr, delay);
	}
	catch(err) {
		self.postMessage({ type: 'done', error: err });
	}
};

self.onmessage = async (evt) => {
	if (evt && evt.data && evt.data.type === 'goSolve') {
		solvePuzzle(evt.data.baseBoard, evt.data.delay ? evt.data.delay : 100);
	}
};
