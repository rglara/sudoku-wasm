function sleep(ms: i32): void {
	const now = Date.now();
	while (Date.now() < (now + ms)) {}
}

function strToBits(str: string): i16 {
	return 1 + 2 + 4 + 8 + 16 + 32 + 64 + 128 + 256;
}

declare function onUpdate(
	cellX: i16,
	cellY: i16,
	value: i16,
	isPen: boolean): void;

export function solvePuzzle(puzzleIn: string, delay: i32): boolean {
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
