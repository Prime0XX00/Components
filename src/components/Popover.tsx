import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";

export interface PopoverProps {
	trigger: React.ReactNode;
	children: React.ReactNode;
	align?: "l" | "r";
	orientation?: "t" | "b";
	closeOnClickOutside?: boolean;
	className?: string;
}

export interface PopoverRef {
	close: () => void;
	open: () => void;
	toggle: () => void;
	isOpen: () => boolean;
}

const Popover = forwardRef<PopoverRef, PopoverProps>(
	(
		{
			align = "l",
			orientation = "b",
			closeOnClickOutside = true,
			...props
		},
		ref
	) => {
		useImperativeHandle(ref, () => ({
			close: () => {
				handleClose();
			},
			open: () => {
				handleOpen();
			},
			toggle: () => {
				handleOpen();
			},
			isOpen: () => {
				return isOpen;
			},
		}));

		const handleClose = () => {
			setIsOpen(false);
		};
		const handleOpen = () => {
			setIsOpen(true);
		};
		const handleToggle = () => {
			setIsOpen((prev) => !prev);
		};

		const [isOpen, setIsOpen] = useState(false);
		const [coords, setCoords] = useState<{ top: number; left: number }>({
			top: 0,
			left: 0,
		});

		const triggerWrapperRef = useRef<HTMLDivElement>(null);
		const popoverRef = useRef<HTMLDivElement>(null);

		const calculatePosition = useCallback(() => {
			if (!triggerWrapperRef.current || !popoverRef.current) return;

			const rect = triggerWrapperRef.current.getBoundingClientRect();
			const popoverRect = popoverRef.current.getBoundingClientRect();
			const spacing = 4;
			const scrollX = window.scrollX;
			const scrollY = window.scrollY;

			let top = 0;
			let left = 0;

			switch (align) {
				case "l":
					left = rect.left + scrollX;
					break;
				case "r":
					left = rect.right + scrollX - popoverRect.width;
					break;
			}

			switch (orientation) {
				case "t":
					top = rect.top + scrollY - spacing - popoverRect.height;
					break;
				case "b":
					top = rect.bottom + scrollY + spacing;
					break;
			}

			setCoords({ top, left });
		}, []);

		useLayoutEffect(() => {
			requestAnimationFrame(() => {
				calculatePosition();
			});
		}, [isOpen, calculatePosition]);

		useEffect(() => {
			if (!isOpen) return;

			const handleClickOutside = (event: MouseEvent) => {
				if (!closeOnClickOutside) return;

				if (
					popoverRef.current &&
					!popoverRef.current.contains(event.target as Node) &&
					!triggerWrapperRef.current?.contains(event.target as Node)
				) {
					setIsOpen(false);
				}
			};

			const handleResize = () => {
				calculatePosition();
			};

			document.addEventListener("mousedown", handleClickOutside);
			window.addEventListener("resize", handleResize);
			window.addEventListener("scroll", handleResize);

			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
				window.removeEventListener("resize", handleResize);
				window.removeEventListener("scroll", handleResize);
			};
		}, [isOpen, calculatePosition]);

		return (
			<>
				<div
					ref={triggerWrapperRef}
					onClick={handleToggle}
					className={`w-fit h-fit`}
				>
					{props.trigger}
				</div>

				{isOpen &&
					createPortal(
						<div
							ref={popoverRef}
							style={{
								top: coords.top,
								left: coords.left,
							}}
							className={`${props.className} origin-center absolute z-[1100] shadow-md border border-(--border) rounded-(--rounded) bg-(--bg) text-(--fg) p-2`}
						>
							{props.children}
						</div>,
						document.body
					)}
			</>
		);
	}
);

export default Popover;
