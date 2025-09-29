export const BooleanIconRenderer = (value: any) => {
	let className = "";
	let display = "";

	switch (value) {
		case true:
			className =
				"bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300";
			display = "Ja";
			break;

		case false:
			className =
				"bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300";
			display = "Nein";
			break;

		default:
			className =
				"bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300";
			display = "Unbekannt";
			break;
	}

	return (
		<div
			className={`${className} rounded-(--rounded) !w-fit text-center px-3`}
		>
			{display}
		</div>
	);
};
