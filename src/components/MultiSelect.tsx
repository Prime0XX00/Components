import React, { useRef, useState } from "react";
import Popover, { type PopoverRef } from "./Popover";
import Button from "./Button";
import { LuChevronDown } from "react-icons/lu";
import Input from "./Input";

export interface SelectOption {
	label: string;
	value: string | number;
}

export interface MultiSelectChangeEvent {
	target: { value: (string | number)[] };
}

interface MultiSelectProps {
	search?: boolean;
	options?: SelectOption[];
	value?: (string | number)[];
	defaultValue?: (string | number)[];
	onChange?: (e: MultiSelectChangeEvent) => void;
	className?: string;
	disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
	search = false,
	options = [],
	value,
	defaultValue = [],
	onChange,
	className,
	disabled = false,
}) => {
	const popoverRef = useRef<PopoverRef>(null);

	const [internalValues, setInternalValues] =
		useState<(string | number)[]>(defaultValue);
	const [searchTerm, setSearchTerm] = useState("");

	const currentValues = value !== undefined ? value : internalValues;
	const selectedOptions = options.filter((opt) =>
		currentValues.includes(opt.value)
	);

	const toggleValue = (val: string | number) => {
		let newValues: (string | number)[];

		if (currentValues.includes(val)) {
			newValues = currentValues.filter((v) => v !== val);
		} else {
			newValues = [...currentValues, val];
		}

		if (value === undefined) {
			setInternalValues(newValues);
		}

		if (onChange) {
			onChange({ target: { value: newValues } });
		}
	};

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<Popover
			ref={popoverRef}
			trigger={
				<Button
					type="button"
					disabled={disabled || options.length === 0}
					className={`${className} flex items-center space-x-2 justify-between text-nowrap`}
				>
					<span className="truncate max-w-[200px]">
						{selectedOptions.length > 0
							? selectedOptions.map((opt) => opt.label).join(", ")
							: options.length > 0
							? "Auswählen"
							: "Keine Optionen gefunden"}
					</span>
					<LuChevronDown
						size={20}
						strokeWidth={1.5}
					/>
				</Button>
			}
		>
			<div>
				{search && (
					<Input
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Suchen..."
						className="mb-2 w-full"
					/>
				)}

				{filteredOptions.length > 0 ? (
					<ul className="flex flex-col border border-(--border) rounded-(--rounded) bg-(--bg) min-w-[150px] max-h-[300px] overflow-y-auto">
						{filteredOptions.map((option) => {
							const isSelected = currentValues.includes(
								option.value
							);
							return (
								<li
									key={option.value}
									className={`p-1 cursor-pointer flex items-center space-x-2 hover:bg-(--hover) ${
										isSelected
											? "!bg-(--primary-bg) text-(--primary-fg)"
											: ""
									}`}
									onClick={() => toggleValue(option.value)}
								>
									<span>{option.label}</span>
								</li>
							);
						})}
					</ul>
				) : (
					<p className="min-w-[100px] w-fit">
						Keine Optionen gefunden.
					</p>
				)}
			</div>
		</Popover>
	);
};

export default MultiSelect;
