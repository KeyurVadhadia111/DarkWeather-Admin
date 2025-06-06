import React from "react";
import { useAppState } from "./useAppState";
import { Button } from "./Button";
import Icon from "./Icon";

interface Props {
	totalRecords: number;
	recordsPerPage: number;
	currentPage: number;
	handlePageChange: (pageNumber: number) => void;
}
const Pagination: React.FC<Props> = ({ totalRecords, recordsPerPage, currentPage, handlePageChange }) => {
	const [{ isDark, userDetails }, setAppState] = useAppState();
	const totalPages = Math.ceil(totalRecords / recordsPerPage);
	const paginationItems = [];

	if (totalPages <= 5) {
		for (let i = 1; i <= totalPages; i++) {
			paginationItems.push(i);
		}
	} else {
		// Always show first page
		paginationItems.push(1);

		// Calculate the range around current page
		let leftBound = Math.max(2, currentPage - 1);
		let rightBound = Math.min(totalPages - 1, currentPage + 1);

		// Adjust bounds to always show 3 numbers
		if (currentPage <= 3) {
			rightBound = Math.max(rightBound, 3);
		} else if (currentPage >= totalPages - 2) {
			leftBound = Math.min(leftBound, totalPages - 2);
		}

		// Add left ellipsis if needed
		if (leftBound > 2) {
			paginationItems.push("...");
		}

		// Add the range of numbers
		for (let i = leftBound; i <= rightBound; i++) {
			paginationItems.push(i);
		}

		// Add right ellipsis if needed
		if (rightBound < totalPages - 1) {
			paginationItems.push("...");
		}

		// Always show last page
		paginationItems.push(totalPages);
	}

	return (
		<div className="flex w-full h-14 items-start justify-between">
			<Button
				variant="outline"
				disabled={currentPage === 1}
				onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
				className="group hover:!bg-primary hover:!text-bgcDark h-14 gap-4 pl-6 pr-8 py-4 !border-none !bg-bgc dark:!bg-fgcDark !rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
				<Icon icon="arrow-left" className="w-7 h-7" />
				<span className=" font-medium text-base leading-6">Previous</span>
			</Button>

			<div className="flex items-center gap-4">
				{paginationItems.map((item, index) =>
					typeof item === "number" ? (
						<Button
							key={index}
							variant="outline"
							onClick={() => handlePageChange(item)}
							className={`hover:!bg-primary hover:!text-bgcDark w-14 h-14 flex items-center justify-center !rounded-full !border-none ${
								item === currentPage ? "!bg-primary !text-bgcDark" : "!bg-bgc dark:!bg-fgcDark"
							}`}
							disabled={item === currentPage}>
							<span className=" font-medium text-xl leading-[26px]">{item}</span>
						</Button>
					) : (
						<span key={index} className="dark:text-textDark font-medium text-xl leading-[26px]">
							{item}
						</span>
					),
				)}
			</div>

			<Button
				variant="outline"
				disabled={currentPage === totalPages}
				onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
				className="group hover:!bg-primary hover:!text-bgcDark h-14 gap-4 pl-8 pr-6 py-4 !bg-bgc dark:!bg-fgcDark !rounded-full !border-none disabled:opacity-50 disabled:cursor-not-allowed">
				<span className=" font-medium text-base leading-6">Next</span>
				<Icon icon="arrow-left" className="w-7 h-7 rotate-180" />
			</Button>
		</div>
	);
};

export default Pagination;
