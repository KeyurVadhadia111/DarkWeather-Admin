// ...existing imports and code...

interface Props {
	totalRecords: number;
	recordsPerPage: number;
	currentPage: number;
	handlePageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ totalRecords, recordsPerPage, currentPage, handlePageChange }) => {
	const totalPages = Math.ceil(totalRecords / recordsPerPage);

	const goToPage = (page: number) => {
		if (page < 1 || page > totalPages) return;
		handlePageChange(page);
		setTimeout(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}, 100);
	};

	return (
		<div className="flex items-center gap-1">
			{/* Prev Button */}
			<div
				className={`inline-flex h-8 sm:h-[46px] items-center justify-center gap-8 px-[11.4px] sm:px-4 py-3 relative flex-[0_0_auto] rounded-md sm:rounded-xl border border-solid border-textSecondary/50 ${currentPage === 1 ? "opacity-50 pointer-events-none cursor-default" : "cursor-pointer"}`}
				onClick={() => goToPage(currentPage - 1)}>
				<div className="relative font-normal text-textSecondary dark:text-textDark text-xs sm:text-base tracking-[0] leading-6 whitespace-nowrap">
					Prev
				</div>
			</div>
			{/* Dynamic Pagination */}
			{(() => {
				const pages = [];
				if (totalPages <= 5) {
					for (let i = 1; i <= totalPages; i++) {
						pages.push(i);
					}
				} else if (currentPage <= 2) {
					pages.push(1, 2, 3, "...", totalPages);
				} else if (currentPage >= totalPages - 2) {
					pages.push(1, totalPages - 2, totalPages - 1, "...", totalPages);
				} else {
					pages.push(1, currentPage, currentPage + 1, "...", totalPages);
				}
				return pages.map((page, idx) =>
					page === "..." ? (
						<div
							key={`ellipsis-${idx}`}
							className="inline-flex w-[32px] sm:w-auto  h-8 sm:h-[46px] items-center justify-center gap-8  sm:px-4 py-3 relative flex-[0_0_auto] rounded-md sm:rounded-xl border border-solid border-textSecondary/50 select-none cursor-default">
							<div className=" text-textSecondary dark:text-textDark relative font-normal text-xs sm:text-base tracking-[0] leading-6 whitespace-nowrap">
								...
							</div>
						</div>
					) : (
						<div
							key={page}
							className={`inline-flex w-[32px] sm:w-auto  h-8 sm:h-[46px] items-center justify-center gap-8 sm:px-4 py-3 relative flex-[0_0_auto] rounded-md sm:rounded-xl ${currentPage === page ? "bg-primary" : "border border-solid border-textSecondary/50"} cursor-pointer`}
							onClick={() => goToPage(Number(page))}>
							<div
								className={`relative font-normal ${currentPage === page ? "text-text" : "text-textSecondary dark:text-textDark"} text-xs sm:text-base tracking-[0] leading-6 whitespace-nowrap`}>
								{page}
							</div>
						</div>
					),
				);
			})()}
			{/* Next Button */}
			<div
				className={`inline-flex  h-8 sm:h-[46px] items-center justify-center gap-8 px-[10.5px] sm:px-4 py-3 relative flex-[0_0_auto] rounded-md sm:rounded-xl border border-solid border-textSecondary/50 cursor-pointer ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}`}
				onClick={() => goToPage(currentPage + 1)}>
				<div className="relative font-normal text-textSecondary dark:text-textDark text-xs sm:text-base tracking-[0] leading-6 whitespace-nowrap">
					Next
				</div>
			</div>
		</div>
	);
};

export default Pagination;
