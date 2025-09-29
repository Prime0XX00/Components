import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from "react";
import { compareValues } from "../../helpers";
import Popover from "../Popover";
import Button from "../Button";
import {
	LuChevronFirst,
	LuChevronLast,
	LuChevronLeft,
	LuChevronRight,
	LuEllipsis,
	LuMoveDown,
	LuMoveUp,
	LuRotateCcw,
} from "react-icons/lu";
import Select from "../Select";
import Input from "../Input";
import { aggregate } from "../../helpers/aggregation";
import Loader from "../Loader";
import Filter from "./Filter";
import { Tooltip } from "../Tooltip";

export interface DataTableProps {
	className?: string;
	title?: string;
	columns: Col[];
	resettable?: boolean;
	toggleColVisibility?: boolean;
	searchable?: boolean;
	paging?: boolean;
	info?: boolean;
	tableData?: any[];
}

export type TableExport = "excel" | "csv" | "pdf";

export interface Col<T = any> {
	title: string;
	key: string | number;
	visible?: boolean;
	sortable?: boolean;
	sorted?: Direction;
	exportable?: boolean;
	grouped?: boolean;
	sortType?: SortType;
	render?: (value: T, row: any) => React.ReactNode;
	transform?: (value: T, row: any) => any;
	aggregate?: Aggregation;
	filter?: {
		searchable?: boolean;
		type?: FilterType;
		values?: any[];
		render?: boolean;
	};
}

export type SortType =
	| "string"
	| "number"
	| "date"
	| "boolean"
	| "duration"
	| "MM.yyyy"
	| "dd.MM"
	| "dd.MM.yyyy"
	| "dd.MM.yyyy hh:mm:ss";
export type FilterType = "equal" | "not equal";
export type Aggregation = "count" | "sum" | "avg" | "min" | "max";

export enum Direction {
	ASC = "ASC",
	DESC = "DESC",
}

export interface DataTableRef {}

const CELL_PLACEHOLDER = "-";

const DataTable = forwardRef<DataTableRef, DataTableProps>(
	(
		{
			className = "",
			title = "",
			columns = [],
			resettable = true,
			searchable = true,
			paging = true,
			info = true,
			tableData = [],
		}: DataTableProps,
		ref
	) => {
		useImperativeHandle(ref, () => ({}));

		const [rows, __] = useState<any[]>(tableData);
		const [searchTerm, setSearchTerm] = useState("");
		const [selectedPage, setSelectedPage] = useState(0);
		const [rowAmount, setRowAmount] = useState(paging ? 10 : rows.length);
		const [cols, setCols] = useState<Col[]>(columns);
		const [normalizedCols, setNormalizedCols] = useState<Col[]>([]);
		const [loading, _] = useState(false);

		const visibleCols = useMemo(
			() => cols.filter((col) => col.visible),
			[cols]
		);

		const handleReset = useCallback(() => {
			setSearchTerm("");
			setSelectedPage(0);
			setRowAmount(10);
			setCols(normalizedCols);
		}, [normalizedCols]);

		useEffect(() => {
			setNormalizedCols(
				columns
					.map((col) => {
						col.visible = col.visible ?? true;
						col.sortable = col.sortable ?? true;
						col.filter = col.filter ?? undefined;
						if (col.filter) {
							col.filter.searchable =
								col.filter.searchable ?? false;
							col.filter.type = col.filter.type ?? "equal";
							col.filter.values = col.filter.values ?? [];
						}
						col.grouped = col.grouped ?? false;
						col.sortType = col.sortType ?? "string";
						col.exportable = col.exportable ?? true;
						return col;
					})
					.filter((col) => col.visible)
			);
		}, []);

		useEffect(() => {
			setCols(normalizedCols);
		}, [normalizedCols]);

		const handleChangeDirection = useCallback((targetCol: Col) => {
			if (!targetCol.sortable) {
				return;
			}

			setCols((prevCols) =>
				prevCols?.map((col) =>
					col === targetCol
						? {
								...col,
								sorted:
									col.sorted?.valueOf() === Direction.ASC
										? Direction.DESC
										: Direction.ASC,
						  }
						: {
								...col,
								sorted: undefined,
						  }
				)
			);
		}, []);

		const handleFilterChange = useCallback(
			(targetCol: Col, newFilters: any[], newFilterType: FilterType) => {
				setCols((prevCols) =>
					prevCols.map((col) =>
						col.key === targetCol.key
							? {
									...col,
									filter: {
										...col.filter,
										values: newFilters,
										type: newFilterType,
									},
							  }
							: col
					)
				);
			},
			[]
		);

		const handleResetFilters = useCallback((targetCol: Col) => {
			setCols((prevCols) =>
				prevCols.map((col) =>
					col.key === targetCol.key
						? { ...col, filter: { ...col.filter, values: [] } }
						: col
				)
			);
		}, []);

		const transformedRows = useMemo(() => {
			if (!rows) return [];

			return rows.map((row) => {
				const updatedRow = { ...row };

				visibleCols.forEach((col) => {
					if (col.transform) {
						let transformedValue =
							col.transform?.(row[col.key], row) ??
							CELL_PLACEHOLDER;
						updatedRow[col.key] = transformedValue;
					} else if (
						row[col.key] == undefined ||
						row[col.key] == null ||
						row[col.key] === ""
					) {
						updatedRow[col.key] = CELL_PLACEHOLDER;
					} else {
						updatedRow[col.key] = row[col.key];
					}
				});

				return updatedRow;
			});
		}, [rows, visibleCols]);

		const sortedRows = useMemo(() => {
			if (!transformedRows.length) return [];

			const sortCol = cols?.find((c) => c.sorted);
			if (!sortCol) return transformedRows;

			return [...transformedRows].sort((a, b) => {
				const aValue = a[sortCol.key];
				const bValue = b[sortCol.key];
				const result = compareValues(
					aValue,
					bValue,
					sortCol.sortType ?? "string"
				);

				return sortCol.sorted === Direction.ASC ? result : -result;
			});
		}, [transformedRows, cols]);

		const filteredRows = useMemo(() => {
			if (!sortedRows.length) return [];

			return sortedRows.filter((row) => {
				const matchesFilters = visibleCols.every((col) => {
					const filter = col.filter;
					if (
						!filter ||
						!filter?.values ||
						filter?.values.length === 0
					) {
						return true;
					}

					const value = row[col.key];

					if (filter.type === "equal") {
						return filter.values.includes(value);
					} else if (filter.type === "not equal") {
						return !filter.values.includes(value);
					}
					return false;
				});

				const matchesSearchTerm = searchTerm
					? visibleCols.some((col) =>
							String(row[col.key])
								.toLowerCase()
								.includes(searchTerm.toLowerCase())
					  )
					: true;

				return matchesFilters && matchesSearchTerm;
			});
		}, [sortedRows, searchTerm, visibleCols]);

		const distinctRows = useMemo(() => {
			if (!sortedRows.length) return {};

			const result: Record<string, Set<any>> = {};

			for (const row of sortedRows) {
				visibleCols.forEach((col) => {
					if (col.filter) {
						let value = row[col.key];

						if (!result[col.key]) {
							result[col.key] = new Set();
						}

						result[col.key].add(value);
					}
				});
			}

			const uniqueValues: Record<string, any[]> = {};
			for (const key in result) {
				uniqueValues[key] = Array.from(result[key]);
			}

			return uniqueValues;
		}, [sortedRows, visibleCols]);

		const paginatedRows = useMemo(() => {
			const start = selectedPage * rowAmount;
			return filteredRows.slice(start, start + rowAmount);
		}, [selectedPage, filteredRows, rowAmount]);

		const totalPages = Math.ceil(filteredRows.length / rowAmount);

		const isFilterable: boolean = (rows?.length ?? 0) > 0 ? true : false;

		return (
			visibleCols.length > 0 && (
				<div className={`${className}`}>
					<div className="w-full flex justify-between mb-2 items-end">
						<div>
							<p className="text-xl w-full text-start">{title}</p>
						</div>

						<div className="flex gap-x-2 items-end justify-end h-fit">
							{resettable && (
								<Popover
									align="r"
									trigger={
										<Tooltip
											content={
												"weitere Optionen anzeigen"
											}
										>
											<Button
												disabled={loading}
												className="!p-1 h-full !aspect-square flex items-center justify-center"
											>
												<LuEllipsis
													size={20}
													strokeWidth={1.5}
												/>
											</Button>
										</Tooltip>
									}
								>
									<div className="grid grid-cols-1 divide-y divide-(--border)">
										{resettable && (
											<div className="flex justify-between items-center space-x-5 first:pt-0 py-2 last:pb-0">
												<p className="text-nowrap">
													Tabelle zurücksetzen:
												</p>
												<Tooltip content="Setzt Suchbegriff, Sortierungen, Elemente pro Seite & momentane Seite zurück">
													<Button
														className="!p-1"
														onClick={() => {
															handleReset();
														}}
													>
														<LuRotateCcw
															size={20}
															strokeWidth={1.5}
														/>
													</Button>
												</Tooltip>
											</div>
										)}
									</div>
								</Popover>
							)}
						</div>
					</div>

					<div className="w-full flex justify-between items-end gap-x-5">
						{paging && (
							<div className="flex items-center mb-2">
								<Select
									value={rowAmount.toString()}
									onChange={(e) => {
										setRowAmount(Number(e.target.value));
									}}
									options={[
										{ label: "10", value: "10" },
										{ label: "20", value: "20" },
										{ label: "35", value: "35" },
										{ label: "50", value: "50" },
									]}
								></Select>
								<span className="ml-2 hidden md:flex">
									Einträge pro Seite
								</span>
							</div>
						)}

						{searchable && (
							<div className="mb-2">
								<Input
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									value={searchTerm ?? ""}
									placeholder="Suchen..."
									className="w-full"
								/>
							</div>
						)}
					</div>

					<div className="border border-(--border) rounded-(--rounded) overflow-x-auto">
						<table className="w-full border-collapse">
							<thead className="bg-(--table-h-bg) text-(--table-h-fg) p-5">
								{visibleCols.some((col) => col.filter) && (
									<tr>
										{visibleCols.map((col, colIndex) => {
											return (
												<td
													key={colIndex}
													className={`px-2 pt-3 first:rounded-tl-(--rounded) last:rounded-tr-(--rounded) h-fit`}
												>
													{col.filter && (
														<Filter
															disabled={
																loading ||
																!isFilterable
															}
															rows={
																distinctRows[
																	col.key
																]
															}
															col={col}
															onFilterChange={
																handleFilterChange
															}
															onRemoveFilters={
																handleResetFilters
															}
														/>
													)}
												</td>
											);
										})}
									</tr>
								)}
								<tr>
									{visibleCols.map((col, colIndex) => (
										<th
											key={colIndex}
											className={` ${
												col.sortable &&
												"cursor-pointer hover:underline"
											} px-2 py-3 font-normal text-nowrap`}
											onClick={() =>
												handleChangeDirection(col)
											}
										>
											<div className="flex justify-between space-x-5">
												<span className="text-start">
													{col.title}
												</span>
												{col.sortable && (
													<div className="flex items-center">
														<LuMoveUp
															className={`${
																col.sorted?.valueOf() ==
																Direction.ASC
																	? "opacity-100"
																	: "opacity-25"
															} text-(--table-h-fg)`}
															size={16}
															strokeWidth={2}
														/>
														<LuMoveDown
															className={`${
																col.sorted?.valueOf() ==
																Direction.DESC
																	? "opacity-100"
																	: "opacity-25"
															} text-(--table-h-fg) -ml-2`}
															size={16}
															strokeWidth={2}
														/>
													</div>
												)}
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{paginatedRows?.map((row, rowIndex) => (
									<tr
										key={rowIndex}
										className={` ${
											rowIndex === 0 && "border-t"
										} border-b border-(--border) bg-(--table-b-bg) hover:bg-(--table-b-hover-bg)`}
									>
										{visibleCols.map((col, colIndex) => {
											const value = row[col.key];
											const cell = col.render
												? col.render(value, row)
												: value.toString();
											return (
												<td
													key={colIndex}
													className={`${
														col.sorted
															? "bg-(--table-b-hover-bg)"
															: ""
													} px-2 py-2`}
												>
													{cell}
												</td>
											);
										})}
									</tr>
								))}

								{loading ? (
									<tr className="border-y border-(--border)">
										<td
											colSpan={visibleCols.length}
											className="px-2 py-2 text-center"
										>
											<Loader
												className="mx-auto"
												loading={loading}
											></Loader>
										</td>
									</tr>
								) : (
									paginatedRows?.length === 0 && (
										<tr className="border-y border-(--border)">
											<td
												colSpan={visibleCols.length}
												className="px-2 py-2 text-center"
											>
												Keine Einträge gefunden.
											</td>
										</tr>
									)
								)}
							</tbody>
							<tfoot className="bg-(--table-f-bg) text-(--table-f-fg)">
								<tr>
									{visibleCols.map((col, colIndex) => (
										<td
											key={colIndex}
											className={`min-h-6 h-6 p-2 first:rounded-bl-(--rounded) last:rounded-br-(--rounded)`}
										>
											{col.aggregate
												? aggregate(col, filteredRows)
												: ""}
										</td>
									))}
								</tr>
							</tfoot>
						</table>
					</div>

					<div className="w-full flex justify-between items-center gap-x-5">
						{info && (
							<div className="mt-2">
								{loading ? (
									<p>Einträge werden geladen...</p>
								) : (
									<>
										<p className="hidden lg:block">
											Zeige{" "}
											{filteredRows.length > 0
												? selectedPage * rowAmount + 1
												: 0}{" "}
											bis{" "}
											{selectedPage * rowAmount +
												paginatedRows.length}{" "}
											von {filteredRows.length} Einträgen
										</p>
										<p className="block lg:hidden">
											{filteredRows.length > 0
												? selectedPage * rowAmount + 1
												: 0}
											{" - "}
											{selectedPage * rowAmount +
												paginatedRows.length}
											{" / "} {filteredRows.length}
										</p>
									</>
								)}
							</div>
						)}

						{paging && (
							<div className="flex space-x-2 items-center mt-2">
								<Tooltip content="Zur ersten Seite">
									<Button
										className="!p-1"
										disabled={selectedPage === 0}
										onClick={() => setSelectedPage(0)}
									>
										<LuChevronFirst
											size={20}
											strokeWidth={1.5}
										/>
									</Button>
								</Tooltip>

								<Tooltip content="Zur vorherigen Seite">
									<Button
										className="!p-1"
										disabled={selectedPage === 0}
										onClick={() =>
											setSelectedPage((prev) => prev - 1)
										}
									>
										<LuChevronLeft
											size={20}
											strokeWidth={1.5}
										/>
									</Button>
								</Tooltip>

								<p className="hidden lg:block">
									Seite {selectedPage + 1} von {totalPages}
								</p>
								<p className="block lg:hidden">
									{selectedPage + 1} {" / "}
									{totalPages}
								</p>

								<Tooltip content="Zur nächsten Seite">
									<Button
										className="!p-1"
										disabled={
											selectedPage >= totalPages - 1
										}
										onClick={() =>
											setSelectedPage((prev) => prev + 1)
										}
									>
										<LuChevronRight
											size={20}
											strokeWidth={1.5}
										/>
									</Button>
								</Tooltip>

								<Tooltip content="Zur letzten Seite">
									<Button
										className="!p-1"
										disabled={
											selectedPage >= totalPages - 1
										}
										onClick={() =>
											setSelectedPage(totalPages - 1)
										}
									>
										<LuChevronLast
											size={20}
											strokeWidth={1.5}
										/>
									</Button>
								</Tooltip>
							</div>
						)}
					</div>
				</div>
			)
		);
	}
);

export default DataTable;
