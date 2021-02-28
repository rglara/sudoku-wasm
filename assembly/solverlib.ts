declare function onUpdate(cellX: i16, cellY: i16, value: i16, isPen: boolean): void;

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

function sendUpdate(delay: i32, cellX: i16, cellY: i16, value: string, isPen: boolean): void {
	onUpdate(cellX, cellY, strToBits(value), isPen);
	sleep(delay);
}

class Coordinates { constructor(public x: i16, public y: i16) {}};
function getCoordsFromIndex(index: i32): Coordinates {
	return new Coordinates(index % 9 as i16, Math.floor(index / 9) as i16);
}

function markWithPen(
	knowns: Array<string>, guesses: Array<string>, matrixIndex: i32, val: string, delay: i32
): void {
	knowns[matrixIndex] = val;
	guesses[matrixIndex] = val;
	const coords = getCoordsFromIndex(matrixIndex);
	const indices = columnRowIndices(coords.x, coords.y);
	for (let d = 0; d < indices.length; d += 1) {
		const index = indices[d];
		let currentGuess = guesses[index];
		if (currentGuess.includes(val)) {
			const crX: i16 = index % 9;
			const crY: i16 = Math.floor(index / 9) as i16;
			const newGuess = currentGuess.replace(val, '');
			guesses[index] = newGuess;
			sendUpdate(delay, crX, crY, newGuess, false);
		}
	}
}

export function solvePuzzle(puzzleIn: string, delay: i32): i16 {
	const guessMatrix: Array<string> = new Array<string>(81);
	for (let g = 0; g < guessMatrix.length; g += 1) { guessMatrix[g] = '123456789'; }
	const knownMatrix: Array<string> = new Array<string>(81);
	for (let k = 0; k < knownMatrix.length; k += 1) { knownMatrix[k] = ''; }

	// set all empty cells to have all pencil marks
	for (let i = 0; i < puzzleIn.length; i += 1) {
		const val: string = puzzleIn.charAt(i);
		if (!'123456789'.includes(val)) {
			const coords = getCoordsFromIndex(i);
			sendUpdate(delay, coords.x, coords.y, '123456789', false);
		}
	}

	let numKnown: i16 = 0;
	// input puzzle input into known matrix
	for (let i = 0; i < puzzleIn.length; i += 1) {
		const val: string = puzzleIn.charAt(i);
		if ('123456789'.includes(val)) {
			numKnown += 1;
			markWithPen(knownMatrix, guessMatrix, i, val, delay);
		}
	}

	let hasChanged = false;
	do {
		hasChanged = false;

		// Rule 1: If any cell has only one remaining guess, mark it in pen

		// Rule 2a: If any row only has one possibility for a spot, mark it in pen

		// Rule 2b: If any column only has one possibility for a spot, mark it in pen

		// Rule 2c: If any supercell only has one possibility for a spot, mark it in pen

	} while (hasChanged);

	return numKnown;
}
