declare function onUpdate(evt: string): void;

export function exampleFunction(a: string, b: string): string {
	const output = a + ' ' + b;
	onUpdate('DEBUG: ' + output);
	return output;
}