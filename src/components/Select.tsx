import React, { useRef, useState } from "react";
import Popover, { type PopoverRef } from "./Popover";
import Button from "./Button";
import { LuChevronDown } from "react-icons/lu";
import Input from "./Input";

export interface SelectOption {
	label: string;
	value: string | number;
}

interface SelectProps {
	search?: boolean;
	options?: SelectOption[];
	value?: string | number;
	defaultValue?: string | number;
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	className?: string;
	disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
	search = false,
	options = [],
	value,
	defaultValue,
	onChange,
	className = "",
	disabled = false,
}) => {
	const selectPopoverRef = useRef<PopoverRef>(null);

	const [internalValue, setInternalValue] = useState(defaultValue);
	const [searchTerm, setSearchTerm] = useState("");

	const currentValue = value !== undefined ? value : internalValue;
	const selectedOption = options.find((opt) => opt.value === currentValue);

	const handleSelect = (val: string | number) => {
		selectPopoverRef.current?.close();
		if (val === currentValue) {
			val = "";
		}

		if (value === undefined) {
			setInternalValue(val);
		}

		if (onChange) {
			const event = {
				...new Event("change"),
				target: { value: val },
			} as unknown as React.ChangeEvent<HTMLSelectElement>;

			onChange(event);
		}
	};

	const filteredOptions = options.filter((option) =>
		option.label?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<Popover
			ref={selectPopoverRef}
			trigger={
				<Button
					type="button"
					disabled={disabled || options.length == 0}
					className={`${className} flex items-center space-x-2 justify-between text-nowrap`}
				>
					<span>
						{selectedOption?.label
							? selectedOption.label
							: options.length > 0
							? "Auswählen"
							: "Keine Optionen angegeben"}
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
						onChange={(e) => setSearchTerm(e.target.value)}
						value={searchTerm}
						placeholder="Suchen..."
						className="mb-2 w-full"
					/>
				)}

				{filteredOptions.length > 0 ? (
					<ul className="flex flex-col border border-(--border) rounded-(--rounded) bg-(--bg) min-w-[150px] max-h-[300px] overflow-y-auto">
						{filteredOptions.map((option) => {
							const isSelected = option.value === currentValue;
							return (
								<li
									key={option.value}
									className={`p-1 cursor-pointer flex items-center space-x-2 hover:bg-(--hover) ${
										isSelected
											? "!bg-(--primary-bg) text-(--primary-fg)"
											: ""
									}`}
									onClick={() => handleSelect(option.value)}
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

export default Select;
