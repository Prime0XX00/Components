import type { SortType } from "../components/DataTable/DataTable";

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseDateString(dateStr: string, format: string): Date {
	const [datePartRaw, timePartRaw] = dateStr.trim().split(" ");
	const timePart = timePartRaw || "00:00:00";

	let day = 1,
		month = 0,
		year = 1970;

	const [hours, minutes, seconds] = timePart
		.split(":")
		.map((x) => parseInt(x) || 0);

	const dateParts = datePartRaw.split(/[\.\-\/]/);
	const formatParts = format.split(/[\.\-\/]/);

	for (let i = 0; i < formatParts.length; i++) {
		const part = formatParts[i];
		const value = parseInt(dateParts[i]);
		if (isNaN(value)) continue;

		switch (part) {
			case "dd":
				day = value;
				break;
			case "MM":
				month = value - 1;
				break;
			case "yyyy":
				year = value;
				break;
		}
	}

	return new Date(year, month, day, hours, minutes, seconds);
}

export function parseFormattedDurationToMinutes(value: string): number {
	if (!value) return 0;

	const regex = /(?:(\d+)\s*d)?(?:,\s*)?(?:(\d+)\s*h)?/;
	const match = value.match(regex);

	if (!match) return 0;

	const days = parseInt(match[1] || "0", 10);
	const hours = parseInt(match[2] || "0", 10);

	return days * 24 * 60 + hours * 60;
}

function parseDate(value: any, format?: string): Date {
	if (!format) return new Date(value);
	return parseDateString(value, format);
}

export function compareValues(a: any, b: any, type: SortType): number {
	switch (type) {
		case "number":
			return (a ?? 0) - (b ?? 0);

		case "string":
			return (a ?? "").localeCompare(b ?? "");

		case "date":
		case "dd.MM.yyyy":
		case "dd.MM":
		case "MM.yyyy":
		case "dd.MM.yyyy hh:mm:ss":
			const dateA = parseDate(a, type);
			const dateB = parseDate(b, type);

			return dateA.getTime() - dateB.getTime();

		case "boolean":
			return a === b ? 0 : a ? -1 : 1;

		case "duration":
			return (
				parseFormattedDurationToMinutes(a) -
				parseFormattedDurationToMinutes(b)
			);

		default:
			return 0;
	}
}

export const formatLocalDate = (date: Date): string => {
	return (
		date.getFullYear() +
		"-" +
		String(date.getMonth() + 1).padStart(2, "0") +
		"-" +
		String(date.getDate()).padStart(2, "0")
	);
};
