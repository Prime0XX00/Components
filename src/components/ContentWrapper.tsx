import React, { type ReactNode } from "react";

interface ContentWrapper {
	children?: ReactNode;
	className?: string;
}

const ContentWrapper: React.FC<ContentWrapper> = ({
	className = "",
	...props
}) => {
	return (
		<div className={`mx-auto max-w-(--w-wrapper) px-5 ${className}`}>
			{props.children}
		</div>
	);
};

export default ContentWrapper;
