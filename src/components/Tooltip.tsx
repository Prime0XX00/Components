import {
	useState,
	useRef,
	useLayoutEffect,
	cloneElement,
	isValidElement,
	type ReactElement,
} from "react";
import ReactDOM from "react-dom";

type TooltipProps = {
	children: ReactElement;
	content: React.ReactNode;
	position?: "t" | "b" | "l" | "r";
};

export function Tooltip({ children, content, position = "t" }: TooltipProps) {
	const [visible, setVisible] = useState(false);
	const [coords, setCoords] = useState<{ top: number; left: number }>({
		top: 0,
		left: 0,
	});
	const triggerRef = useRef<HTMLElement | null>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!visible || !triggerRef.current || !tooltipRef.current) return;
		const rect = triggerRef.current.getBoundingClientRect();
		const tooltipRect = tooltipRef.current.getBoundingClientRect();
		const scrollX = window.scrollX;
		const scrollY = window.scrollY;
		const spacing = 6;

		let top = 0,
			left = 0;
		switch (position) {
			case "t":
				top = rect.top + scrollY - tooltipRect.height - spacing;
				left =
					rect.left +
					scrollX +
					rect.width / 2 -
					tooltipRect.width / 2;
				break;
			case "b":
				top = rect.bottom + scrollY + spacing;
				left =
					rect.left +
					scrollX +
					rect.width / 2 -
					tooltipRect.width / 2;
				break;
			case "l":
				top =
					rect.top +
					scrollY +
					rect.height / 2 -
					tooltipRect.height / 2;
				left = rect.left + scrollX - tooltipRect.width - spacing;
				break;
			case "r":
				top =
					rect.top +
					scrollY +
					rect.height / 2 -
					tooltipRect.height / 2;
				left = rect.right + scrollX + spacing;
				break;
		}

		setCoords({ top, left });
	}, [visible, position]);

	if (!isValidElement(children)) return null;

	return (
		<>
			{cloneElement(children as any, {
				ref: triggerRef,
				onMouseEnter: () => setVisible(true),
				onMouseLeave: () => setVisible(false),
			})}
			{visible &&
				ReactDOM.createPortal(
					<div
						ref={tooltipRef}
						style={{
							position: "absolute",
							top: coords.top,
							left: coords.left,
						}}
						className="z-[2000] px-2 py-1 bg-(--tooltip-bg) text-(--tooltip-fg) rounded-(--rounded) shadow pointer-events-none"
					>
						{content}
					</div>,
					document.body
				)}
		</>
	);
}
