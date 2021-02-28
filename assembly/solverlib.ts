function sleep(ms: i32): void {
	const now = Date.now();
	while (Date.now() < (now + ms)) {}
}

function strToBits(str: string): i16 {
	let output: i16 = 0;
	output += str.includes('1') ? 1 : 0;
	output += str.includes('2') ? 2 : 0;
	output += str.includes('3') ? 4 : 0;
	output += str.includes('4') ? 8 : 0;
	output += str.includes('5') ? 16 : 0;
	output += str.includes('6') ? 32 : 0;
	output += str.includes('7') ? 64 : 0;
	output += str.includes('8') ? 128 : 0;
	output += str.includes('9') ? 256 : 0;
	return output;
}

function columnRowIndices(x: i16, y: i16): Array<i16> {
	const output: Array<i16> = new Array<i16>();
	// row indices
	for (let nx: i16 = 0; nx < 9; nx += 1) {
		if (nx !== x) {
			output.push(y*9 + nx);
		}
	}
	// column indices
	for (let ny: i16 = 0; ny < 9; ny += 1) {
		if (ny !== y) {
			output.push(ny*9 + x);
		}
	}
	return output;
}

declare function onUpdate(cellX: i16, cellY: i16, value: i16, isPen: boolean): void;

function sendUpdate(delay: i32, cellX: i16, cellY: i16, value: string, isPen: boolean): void {
	onUpdate(cellX, cellY, strToBits(value), isPen);
	sleep(delay);
}

export function solvePuzzle(puzzleIn: string, delay: i32): i16 {
	const guessMatrix: Array<string> = new Array<string>(81);
	for (let g = 0; g < guessMatrix.length; g += 1) { guessMatrix[g] = '123456789'; }
	const knownMatrix: Array<string> = new Array<string>(81);
	for (let k = 0; k < knownMatrix.length; k += 1) { knownMatrix[k] = ''; }

	// set all empty cells to have all pencil marks
	let x: i16 = 0;
	let y: i16 = 0;
	for (let i = 0; i < puzzleIn.length; i += 1) {
		const val: string = puzzleIn.charAt(i);
		if (!'123456789'.includes(val)) {
			sendUpdate(delay, x, y, '123456789', false);
		}
		x += 1;
		if (x > 8) {
			x = 0;
			y += 1;
		}
	}

	x = 0;
	y = 0;
	let numKnown: i16 = 0;
	// input puzzle input into known matrix
	for (let i = 0; i < puzzleIn.length; i += 1) {
		const val: string = puzzleIn.charAt(i);
		if ('123456789'.includes(val)) {
			knownMatrix[i] = val;
			numKnown += 1;
			guessMatrix[i] = val;
			const indices = columnRowIndices(x, y);
			for (let d = 0; d < indices.length; d += 1) {
				const index = indices[d];
				let currentGuess = guessMatrix[index];
				if (currentGuess.includes(val)) {
					const crX: i16 = index % 9;
					const crY: i16 = Math.floor(index / 9) as i16;
					const newGuess = currentGuess.replace(val, '');
					guessMatrix[index] = newGuess;
					sendUpdate(delay, crX, crY, newGuess, false);
				}
			}
		}
		x += 1;
		if (x > 8) {
			x = 0;
			y += 1;
		}
	}

	let hasChanged = false;
	do {
		hasChanged = false;

	} while (hasChanged);

	return numKnown;
}
