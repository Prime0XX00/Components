import React, { useEffect, useRef } from "react";
import type { PopoverRef } from "./Popover";
import Popover from "./Popover";
import Button from "./Button";
import { LuCalendar, LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface DatePickerProps {
	value?: Date | null;
	onChange?: (date: Date) => void;
	minDate?: Date;
	maxDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
	value,
	onChange,
	minDate,
	maxDate,
}) => {
	if (minDate) {
		minDate.setHours(0, 0, 0, 0);
	}
	if (maxDate) {
		maxDate.setHours(0, 0, 0, 0);
	}

	const [internalDate, setInternalDate] = React.useState<Date | null>(
		value || null
	);
	const selectedDate = value ?? internalDate;

	const [currentMonth, setCurrentMonth] = React.useState(
		selectedDate || new Date()
	);

	useEffect(() => {
		if (value !== undefined) {
			setInternalDate(value);
		}
	}, [value]);

	const getDaysInMonth = (year: number, month: number) => {
		const date = new Date(year, month, 1);
		const days = [];
		while (date.getMonth() === month) {
			days.push(new Date(date));
			date.setDate(date.getDate() + 1);
		}
		return days;
	};

	const days = getDaysInMonth(
		currentMonth.getFullYear(),
		currentMonth.getMonth()
	);

	const handlePrevMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
		);
	};

	const handleNextMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
		);
	};

	const formatted = selectedDate
		? selectedDate.toLocaleDateString()
		: "Datum wählen";

	const handleSelect = (date: Date) => {
		datePickerPopoverRef.current?.close();
		if (onChange) {
			onChange(date);
		} else {
			setInternalDate(date);
		}
	};

	const isDisabled = (day: Date) => {
		if (minDate && day < minDate) return true;
		if (maxDate && day > maxDate) return true;
		return false;
	};

	const getStartPadding = (date: Date) => {
		const day = date.getDay();
		return (day + 6) % 7;
	};

	const datePickerPopoverRef = useRef<PopoverRef>(null);

	return (
		<Popover
			ref={datePickerPopoverRef}
			trigger={
				<Button
					type="button"
					className="flex justify-between items-center space-x-2"
				>
					<span>{formatted}</span>
					<LuCalendar
						size={20}
						strokeWidth={1.5}
					/>
				</Button>
			}
		>
			<div className="flex justify-between items-center mb-2">
				<Button
					className="!p-1"
					onClick={handlePrevMonth}
				>
					<LuChevronLeft
						size={20}
						strokeWidth={1.5}
					/>
				</Button>
				<span>
					{currentMonth.toLocaleString("default", { month: "long" })}{" "}
					{currentMonth.getFullYear()}
				</span>
				<Button
					className="!p-1"
					onClick={handleNextMonth}
				>
					<LuChevronRight
						size={20}
						strokeWidth={1.5}
					/>
				</Button>
			</div>

			<div className="grid grid-cols-7 gap-1 text-center">
				{["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
					<div
						key={d}
						className="font-bold text-sm"
					>
						{d}
					</div>
				))}
				{Array(getStartPadding(days[0]))
					.fill(null)
					.map((_, idx) => (
						<div key={`empty-${idx}`} />
					))}
				{days.map((day) => {
					const isSelected =
						selectedDate?.toDateString() === day.toDateString();
					return (
						<Button
							disabled={isDisabled(day)}
							key={day.toISOString()}
							onClick={() => handleSelect(day)}
							className={`${
								isSelected
									? "!bg-(--primary-bg) !text-(--primary-fg)"
									: ""
							}`}
						>
							{day.getDate()}
						</Button>
					);
				})}
			</div>
		</Popover>
	);
};
