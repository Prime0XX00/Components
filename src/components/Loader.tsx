interface LoaderProps {
	loading: boolean;
	className?: string;
}

const Loader = ({ loading = false, className }: LoaderProps) => {
	return (
		loading && (
			<div className={`${className} flex items-center justify-center w-full`}>
				<div
					className="text-(--primary-bg) animate-spin inline-block size-6 border-[4px] border-current border-t-transparent rounded-full"
					role="status"
					aria-label="loading"
				>
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		)
	);
};

export default Loader;
