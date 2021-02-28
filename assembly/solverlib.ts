declare function onUpdate(cellX: i16, cellY: i16, value: i16, isPen: boolean): void;

const ALL_VALUES: string = '123456789';

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

class Coordinates { constructor(public x: i16, public y: i16) {}};
function getCoordsFromIndex(index: i32): Coordinates {
	return new Coordinates(index % 9 as i16, Math.floor(index / 9) as i16);
}

function getIndexFromCoords(x: i16, y: i16): i32 {
	return y*9 + x;
}

function getRowIndices(row: i16): Array<i32> {
	const output = new Array<i32>();
	for (let i: i16 = 0; i < 9; i += 1) { output.push(getIndexFromCoords(i, row)); }
	return output;
}

function getColumnIndices(col: i16): Array<i32> {
	const output = new Array<i32>();
	for (let i: i16 = 0; i < 9; i += 1) { output.push(getIndexFromCoords(col, i)); }
	return output;
}

function getSuperIndices(index: i16): Array<i32> {
	const output = new Array<i32>();
	const cX: i16 = index % 3 as i16;
	const cY: i16 = Math.floor(index / 3) as i16;
	const originX: i16 = cX * 3 as i16;
	const originY: i16 = cY * 3 as i16;
	for (let sy: i16 = 0; sy < 3; sy += 1) {
		for (let sx: i16 = 0; sx < 3; sx += 1) {
			output.push(getIndexFromCoords(originX + sx, originY + sy));
		}
	}
	return output;
}

function columnRowSuperIndices(x: i16, y: i16): Array<i32> {
	const output: Array<i32> = new Array<i32>();
	// row indices
	for (let nx: i16 = 0; nx < 9; nx += 1) {
		if (nx !== x) {
			output.push(getIndexFromCoords(nx, y));
		}
	}
	// column indices
	for (let ny: i16 = 0; ny < 9; ny += 1) {
		if (ny !== y) {
			output.push(getIndexFromCoords(x, ny));
		}
	}
	// super cell indices
	const originX: i16 = Math.floor(x / 3) * 3 as i16;
	const originY: i16 = Math.floor(y / 3) * 3 as i16;
	for (let sy: i16 = 0; sy < 3; sy += 1) {
		for (let sx: i16 = 0; sx < 3; sx += 1) {
			const workingX: i16 = originX + sx;
			const workingY: i16 = originY + sy;
			const index = getIndexFromCoords(workingX, workingY);
			if (!((workingX === x) && (workingY === y)) && !output.includes(index)) {
				output.push(index);
			}
		}
	}
	return output;
}

function sendUpdate(delay: i32, cellX: i16, cellY: i16, value: string, isPen: boolean): void {
	let val: i16 = parseInt(value, 10) as i16;
	if (!isPen) {
		val = strToBits(value);
	}
	onUpdate(cellX, cellY, val, isPen);
	sleep(delay);
}

function markWithPen(
	knowns: Array<string>, guesses: Array<string>, matrixIndex: i32, val: string, delay: i32
): void {
	const coords = getCoordsFromIndex(matrixIndex);
	knowns[matrixIndex] = val;
	sendUpdate(delay, coords.x, coords.y, val, true);

	const indices = columnRowSuperIndices(coords.x, coords.y);
	guesses[matrixIndex] = val;
	for (let d = 0; d < indices.length; d += 1) {
		const index = indices[d];
		let currentGuess = guesses[index];
		if (currentGuess.includes(val)) {
			const crX: i16 = index % 9 as i16;
			const crY: i16 = Math.floor(index / 9) as i16;
			const newGuess = currentGuess.replace(val, '');
			guesses[index] = newGuess;
			sendUpdate(delay, crX, crY, newGuess, false);
		}
	}
}

function ruleLastOneStanding(
	knowns: Array<string>, guesses: Array<string>, indices: Array<i32>, checkVal: string
): i32 {
	let foundIndex = -1;
	for (let i = 0; i < indices.length; i += 1) {
		const currentIndex = indices[i];
		if (!knowns[currentIndex].length) {
			if (guesses[currentIndex].includes(checkVal)) {
				if (foundIndex < 0) {
					foundIndex = currentIndex;
				} else {
					foundIndex = -1;
					break;
				}
			}
		}
	}
	return foundIndex;
}

export function solvePuzzle(puzzleIn: string, delay: i32): i16 {
	const guessMatrix: Array<string> = new Array<string>(81);
	for (let g = 0; g < guessMatrix.length; g += 1) { guessMatrix[g] = ALL_VALUES; }
	const knownMatrix: Array<string> = new Array<string>(81);
	for (let k = 0; k < knownMatrix.length; k += 1) { knownMatrix[k] = ''; }

	// set all empty cells to have all pencil marks
	for (let i = 0; i < puzzleIn.length; i += 1) {
		const val: string = puzzleIn.charAt(i);
		if (!ALL_VALUES.includes(val)) {
			const coords = getCoordsFromIndex(i);
			sendUpdate(delay, coords.x, coords.y, ALL_VALUES, false);
		}
	}

	let numKnown: i16 = 0;
	// input puzzle input into known matrix
	for (let i = 0; i < puzzleIn.length; i += 1) {
		const val: string = puzzleIn.charAt(i);
		if (ALL_VALUES.includes(val)) {
			numKnown += 1;
			markWithPen(knownMatrix, guessMatrix, i, val, delay);
		}
	}

	let hasChanged = false;
	do {
		hasChanged = false;

		// Rule 1: If any cell has only one remaining guess, mark it in pen
		for (let i = 0; i < knownMatrix.length; i += 1) {
			const knownValue = knownMatrix[i];
			if (!knownValue.length) {
				const guessValue = guessMatrix[i];
				if ((guessValue !== knownValue) && (guessValue.length === 1)) {
					numKnown += 1;
					hasChanged = true;
					markWithPen(knownMatrix, guessMatrix, i, guessValue, delay);
				}
			}
		}

		for (let group: i16 = 0; group < 9; group += 1) {
			const rowIndices = getRowIndices(group);
			const columnIndices = getColumnIndices(group);
			const superIndices = getSuperIndices(group);
			for (let ch = 0; ch < ALL_VALUES.length; ch += 1) {
				const checkVal = ALL_VALUES.charAt(ch);

				// Rule 2a: If any row only has one possibility for a spot, mark it in pen
				const rowIndex = ruleLastOneStanding(knownMatrix, guessMatrix, rowIndices, checkVal);
				if (rowIndex > -1) {
					numKnown += 1;
					hasChanged = true;
					markWithPen(knownMatrix, guessMatrix, rowIndex, checkVal, delay);
				}

				// Rule 2b: If any column only has one possibility for a spot, mark it in pen
				const columnIndex = ruleLastOneStanding(knownMatrix, guessMatrix, columnIndices, checkVal);
				if (columnIndex > -1) {
					numKnown += 1;
					hasChanged = true;
					markWithPen(knownMatrix, guessMatrix, columnIndex, checkVal, delay);
				}

				// Rule 2c: If any supercell only has one possibility for a spot, mark it in pen
				const superIndex = ruleLastOneStanding(knownMatrix, guessMatrix, superIndices, checkVal);
				if (superIndex > -1) {
					numKnown += 1;
					hasChanged = true;
					markWithPen(knownMatrix, guessMatrix, superIndex, checkVal, delay);
				}
			}
		}
	} while (hasChanged);

	return numKnown;
}
