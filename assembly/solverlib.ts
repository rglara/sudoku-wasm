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

declare function onUpdate(
	cellX: i16,
	cellY: i16,
	value: i16,
	isPen: boolean): void;

export function solvePuzzle(puzzleIn: string, delay: i32): boolean {
	// set all empty cells to have all pencil marks
	let x: i16 = 0;
	let y: i16 = 0;
	for (let i = 0; i < puzzleIn.length; i += 1) {
		const val: string = puzzleIn.charAt(i);
		if (!'123456789'.includes(val)) {
			onUpdate(x, y, strToBits('123456789'), false);
			sleep(delay);
		}
		x += 1;
		if (x > 8) {
			x = 0;
			y += 1;
		}
	}
	return true;
}
