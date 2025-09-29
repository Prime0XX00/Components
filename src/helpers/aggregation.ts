import type { Col } from "../components/DataTable/DataTable";

export function aggregate(col: Col, rows: any[]) {
	const aggregation = col.aggregate;

	if (rows.length === 0) {
		return "";
	}

	switch (aggregation) {
		case "sum":
			return sum(col, rows);
		case "count":
			return count(col, rows);
		case "avg":
			return avg(col, rows);
		case "min":
			return min(col, rows);
		case "max":
			return max(col, rows);
	}
}

function sum(col: Col, rows: any[]): string {
	let result = 0;

	rows.forEach((row) => {
		let temp = row[col.key];
		if (typeof temp != "number") {
			return;
		}
		result += temp;
	});

	return `Summe: ${result % 1 == 0 ? result : result.toFixed(3)}`;
}

function count(_: Col, rows: any[]): string {
	let result = rows.length;

	return `Anzahl: ${result}`;
}

function avg(col: Col, rows: any[]): string {
	let result = 0;

	rows.forEach((row) => {
		let temp = row[col.key];
		if (typeof temp != "number") {
			return;
		}
		result += temp;
	});
	result /= rows.length;

	return `Durchschnitt: ${result.toFixed(3)}`;
}

function min(col: Col, rows: any[]): string {
	let result = Infinity;

	rows.forEach((row) => {
		let temp = row[col.key];
		if (temp < result) {
			result = temp;
		}
	});

	return `Minimum: ${result}`;
}

function max(col: Col, rows: any[]): string {
	let result = -Infinity;

	rows.forEach((row) => {
		let temp = row[col.key];
		if (temp > result) {
			result = temp;
		}
	});

	return `Maximum: ${result}`;
}
