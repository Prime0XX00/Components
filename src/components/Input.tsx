import React from "react";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
	const baseClassName =
		"text-(--fg) bg-(--bg) border border-(--border) rounded-(--rounded) px-3 py-1";
	const disabledClassName = props.disabled ? "opacity-50" : "";
	const readOnlyClassName = props.readOnly ? "text-(--fg)/50" : "";

	return (
		<input
			{...props}
			className={`${className} ${disabledClassName} ${readOnlyClassName} ${baseClassName}`}
		/>
	);
};

export default Input;
