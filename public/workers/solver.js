const solvePuzzle = async () => {
	self.postMessage({ type: 'status', message: 'status 1' });
	await new Promise(resolve => setTimeout(resolve, 500));
	self.postMessage({ type: 'status', message: 'status 2' });
	await new Promise(resolve => setTimeout(resolve, 2000));
	self.postMessage({ type: 'done', error: false });
};

self.onmessage = async (evt) => {
	console.log('trying...');
	if (evt && evt.data && evt.data.type === 'goSolve') {
		console.log('GO!');
		solvePuzzle();
	}
};
