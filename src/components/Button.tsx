export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = ({ ...props }) => {
	const baseClassName =
		"bg-(--bg) text-(--fg) border border-(--border) rounded-(--rounded) px-2.5 py-1";
	const disabledClassName = props.disabled
		? "opacity-50"
		: "cursor-pointer hover:bg-(--hover)";

	return (
		<button
			{...props}
			className={`${props.className} ${disabledClassName} ${baseClassName}`}
		>
			{props.children}
		</button>
	);
};

export default Button;
