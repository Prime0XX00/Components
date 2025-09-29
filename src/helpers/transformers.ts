export function transformDateString(
	value: string,
	format: string = "dd.MM.yyyy"
): string | undefined {
	if (!value) return undefined;

	const date = new Date(value);
	if (isNaN(date.getTime())) return value;

	const pad = (n: number) => n.toString().padStart(2, "0");

	const replacements: Record<string, string> = {
		dd: pad(date.getUTCDate()),
		MM: pad(date.getUTCMonth() + 1),
		yyyy: date.getUTCFullYear().toString(),
		hh: pad(date.getUTCHours()),
		mm: pad(date.getUTCMinutes()),
		ss: pad(date.getUTCSeconds()),
	};

	let formatted = format;
	for (const [key, val] of Object.entries(replacements)) {
		formatted = formatted.replace(new RegExp(key, "g"), val);
	}

	return formatted;
}

export function transformDurationString(value: string): string {
	const regex =
		/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/;

	const match = value.match(regex);

	if (!match) return "Ungültige Dauer";

	const days = parseInt(match[1] || "0", 10);
	const hours = parseInt(match[2] || "0", 10);

	const dayStr = `${days} d`;
	const hourStr = `${hours} h`;

	return `${dayStr}, ${hourStr}`;
}
