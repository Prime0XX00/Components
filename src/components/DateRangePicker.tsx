import React, { useEffect, useState } from "react";
import { DatePicker } from "./DatePicker";

interface DateRangePickerProps {
	startDate?: Date;
	endDate?: Date;
	onChange?: (range: {
		startDate: Date | undefined;
		endDate: Date | undefined;
	}) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
	startDate: startDateProp,
	endDate: endDateProp,
	onChange,
}) => {
	const [startDate, setStartDate] = useState<Date | undefined>(startDateProp);
	const [endDate, setEndDate] = useState<Date | undefined>(endDateProp);

	useEffect(() => {
		setStartDate(startDateProp);
		setEndDate(endDateProp);
	}, [startDateProp, endDateProp]);

	const handleStartDateChange = (date: Date) => {
		setStartDate(date);
		if (endDate && date > endDate) {
			setEndDate(undefined);
		}
		onChange?.({ startDate: date, endDate });
	};

	const handleEndDateChange = (date: Date) => {
		setEndDate(date);
		if (startDate && date < startDate) {
			setStartDate(undefined);
		}
		onChange?.({ startDate, endDate: date });
	};

	return (
		<div className="flex flex-row gap-x-3 justify-center items-center w-fit">
			<DatePicker
				value={startDate}
				onChange={handleStartDateChange}
				maxDate={endDate}
			/>

			<span>-</span>

			<DatePicker
				value={endDate}
				onChange={handleEndDateChange}
				minDate={startDate}
			/>
		</div>
	);
};
