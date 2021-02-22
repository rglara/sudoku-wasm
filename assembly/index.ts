function sleep( ms: i64 ): void {
	const now = Date.now();
	while (Date.now() < (now + ms)) {}
}

declare function onUpdate(
	message: string,
	cellX: i32,
	cellY: i32,
	value: string,
	isPen: boolean): void;

export function solvePuzzle(puzzle: string): boolean {
	let x: i32 = 0;
	let y: i32 = 0;
	for (let i = 0; i < puzzle.length; i += 1) {
		const val: string = puzzle.charAt(i);
		if (!'123456789'.includes(val)) {
			onUpdate('Set all pencil marks (' + x.toString() + ',' + y.toString() + ')', x, y, '123456789', false);
		}
		x += 1;
		if (x > 8) {
			x = 0;
			y += 1;
		}
		sleep(100);
	}
	return true;
}
