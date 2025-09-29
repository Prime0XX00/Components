import { useState } from "react";
import Button from "./Button";

interface CheckboxProps extends React.HTMLProps<HTMLButtonElement> {
	selected?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	selected = false,
	...props
}) => {
	const [checked, setChecked] = useState(selected);
	return (
		<Button
			{...props}
			type="button"
			className="h-[29px] min-w-[50px] w-fit grid grid-cols-2 !p-1 rounded-(--radius)"
			onClick={() => setChecked((prev) => !prev)}
		>
			<div
				className={`h-full !aspect-square w-fit  ${
					checked
						? "translate-x-0 bg-(--primary-bg)"
						: "translate-x-full bg-(--border)"
				} transition-[transform, colors] duration-200 rounded-(--rounded)`}
			></div>
		</Button>
	);
};
