import { useCallback, useMemo, useRef, useState } from "react";
import type { Col, FilterType } from "./DataTable";
import type { PopoverRef } from "../Popover";
import Popover from "../Popover";
import Button from "../Button";
import { LuArrowLeftRight, LuFilter, LuTrash } from "react-icons/lu";
import Input from "../Input";
import { Tooltip } from "../Tooltip";

interface FilterProps {
	rows: any[];
	col: Col;
	onFilterChange?: (col: Col, filters: any[], filterType: FilterType) => void;
	onRemoveFilters?: (col: Col) => void;
	disabled?: boolean;
}

const Filter = ({
	rows,
	col,
	onFilterChange,
	onRemoveFilters,
	disabled = false,
}: FilterProps) => {
	const filters = col.filter?.values ?? [];
	const filterType = col.filter?.type ?? "equal";
	const render = col.filter?.render ?? false;
	const [searchTerm, setSearchTerm] = useState("");

	const filteredOptions = useMemo(() => {
		if (!rows || !searchTerm) return rows || [];

		const lowerSearchTerm = searchTerm.toLowerCase();
		return rows.filter((value) =>
			String(value).toLowerCase().includes(lowerSearchTerm)
		);
	}, [rows, searchTerm]);

	const selectValue = useCallback(
		(value: any) => {
			const newFilters = filters.includes(value)
				? filters.filter((v) => v !== value)
				: [...filters, value];
			onFilterChange?.(col, newFilters, filterType);
		},
		[filters, filterType, col, onFilterChange]
	);

	const changeFilterType = useCallback(
		(newFilterType: FilterType) => {
			onFilterChange?.(col, filters, newFilterType);
		},
		[filters, col, onFilterChange]
	);

	const filterPopoverRef = useRef<PopoverRef>(null);

	return (
		<Popover
			ref={filterPopoverRef}
			trigger={
				<Tooltip
					content={
						<span>
							Filteroptionen für
							<b className="text-(--highlight)"> {col.title} </b>
							bearbeiten
						</span>
					}
				>
					<Button
						disabled={disabled}
						className="relative !p-1"
					>
						<LuFilter
							size={20}
							strokeWidth={1.5}
						/>
						{filters.length > 0 && (
							<div className="bg-(--primary-bg) z-10 rounded-(--rounded) absolute top-0 -translate-y-1/2 right-0 translate-x-1/2 flex justify-center items-center text-sm h-2/3 !aspect-square text-(--primary-fg)">
								{filters.length}
							</div>
						)}
					</Button>
				</Tooltip>
			}
		>
			<div className="flex flex-col gap-y-2">
				<div className="flex justify-between items-center space-x-5">
					<div>
						<p className="text-nowrap">Filtermodus:</p>
						<b className="text-nowrap">
							{filterType === "equal"
								? "Inkludieren"
								: "Exkludieren"}
						</b>
					</div>

					<Tooltip content={"Filtermodus ändern"}>
						<Button
							className="!p-1"
							onClick={() =>
								changeFilterType(
									filterType === "equal"
										? "not equal"
										: "equal"
								)
							}
						>
							<LuArrowLeftRight
								size={20}
								strokeWidth={1.5}
							/>
						</Button>
					</Tooltip>
				</div>

				{col.filter?.searchable && (
					<Input
						onChange={(e) => setSearchTerm(e.target.value)}
						value={searchTerm}
						placeholder="Suchen..."
						className="mb-2 w-full"
					/>
				)}

				{filteredOptions?.length > 0 ? (
					<div className="flex flex-col border border-(--border) rounded-(--rounded) bg-(--bg) max-h-[300px] overflow-y-auto">
						{filteredOptions?.map((value) => {
							const isSelected = filters.includes(value);
							return (
								<span
									className={`${
										isSelected
											? "!bg-(--primary-bg) text-(--primary-fg)"
											: ""
									} p-1 cursor-pointer hover:bg-(--hover)`}
									onClick={() => selectValue(value)}
								>
									{render
										? col?.render?.(value, value)
										: String(value)}
								</span>
							);
						})}
					</div>
				) : (
					<p className="min-w-[100px] w-fit">
						Keine Optionen gefunden.
					</p>
				)}

				{filters.length > 0 && (
					<>
						<div className="flex justify-between items-center space-x-5">
							<p className="text-nowrap">Alle Filter löschen:</p>
							<Button
								onClick={() => {
									onRemoveFilters?.(col);
									filterPopoverRef.current?.close();
								}}
								className="!p-1 border-red-500 dark:border-red-500 text-red-500 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-950"
							>
								<LuTrash
									size={20}
									strokeWidth={1.5}
								/>
							</Button>
						</div>
					</>
				)}
			</div>
		</Popover>
	);
};

export default Filter;
