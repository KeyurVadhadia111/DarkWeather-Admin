import React, { useEffect, useMemo, useState } from "react";
import Pagination from "components/utils/Pagination";
import Icon from "components/utils/Icon";
import { Input } from "components/utils/Input";
import useAppState from "components/utils/useAppState";
import { Link, useLocation } from "react-router-dom";

interface ActivityLog {
	id: number;
	timestamp: string;
	actionType: string;
	actionDescription: string;
	ipAddress: string;
	deviceInfo: string;
}

type SortKey = keyof ActivityLog;
interface SortConfig {
	key: SortKey;
	direction: "asc" | "desc";
}

export default function ActivityLogPage() {
	const [activityLogs] = useState<ActivityLog[]>([
		{
			id: 1,
			timestamp: "2025-06-06 09:42:13",
			actionType: "Login",
			actionDescription: "Successfully logged in",
			ipAddress: "192.168.1.10",
			deviceInfo: "Chrome, Windows 10",
		},
		{
			id: 2,
			timestamp: "2025-06-06 09:44:28",
			actionType: "View",
			actionDescription: "Accessed user list",
			ipAddress: "192.168.1.10",
			deviceInfo: "Chrome, Windows 10",
		},
		{
			id: 3,
			timestamp: "2025-06-06 09:46:12",
			actionType: "Update",
			actionDescription: "Updated role for user",
			ipAddress: "192.168.1.10",
			deviceInfo: "Chrome, Windows 10",
		},
		{
			id: 4,
			timestamp: "2025-06-06 10:03:57",
			actionType: "Login",
			actionDescription: "Successfully logged in",
			ipAddress: "192.168.1.23",
			deviceInfo: "Safari, macOS",
		},
		{
			id: 5,
			timestamp: "2025-06-06 10:05:02",
			actionType: "Subscription Renewed",
			actionDescription: "Subscribed to Premium Plan",
			ipAddress: "192.168.1.23",
			deviceInfo: "Safari, macOS",
		},
		{
			id: 6,
			timestamp: "2025-06-06 10:15:34",
			actionType: "Delete",
			actionDescription: "Deleted document ID",
			ipAddress: "192.168.1.10",
			deviceInfo: "Chrome, Windows 10",
		},
		{
			id: 7,
			timestamp: "2025-06-06 10:17:20",
			actionType: "Purchased Plan",
			actionDescription: "User activity report generated",
			ipAddress: "System",
			deviceInfo: "Chrome, Windows 10",
		},
		{
			id: 8,
			timestamp: "2025-06-06 10:20:45",
			actionType: "View",
			actionDescription: "Accessed user list",
			ipAddress: "192.168.1.32",
			deviceInfo: "Edge, Windows 11",
		},
		{
			id: 9,
			timestamp: "2025-06-06 10:22:19",
			actionType: "Create",
			actionDescription: "Created new user",
			ipAddress: "192.168.1.10",
			deviceInfo: "Chrome, Windows 10",
		},
		{
			id: 10,
			timestamp: "2025-06-06 10:25:02",
			actionType: "Update",
			actionDescription: "Updated profile details",
			ipAddress: "192.168.1.44",
			deviceInfo: "Safari, macOS",
		},
		{
			id: 11,
			timestamp: "2025-06-06 10:27:41",
			actionType: "Purchased Plan",
			actionDescription: "Subscribed to Premium Plan",
			ipAddress: "103.21.244.8",
			deviceInfo: "Chrome, Windows 10",
		},
		{
			id: 12,
			timestamp: "2025-06-06 10:30:11",
			actionType: "Auto Logout",
			actionDescription: "Auto-logged out inactive",
			ipAddress: "192.168.1.10",
			deviceInfo: "Safari, macOS",
		},
	]);
	const [currentPage, setCurrentPage] = useState(1);
	const recordsPerPage = 10;

	const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "timestamp",
		direction: "desc",
	});
	const [searchQuery, setSearchQuery] = useState("");

	const startIdx = (currentPage - 1) * recordsPerPage;
	const endIdx = Math.min(startIdx + recordsPerPage, activityLogs.length);

	const location = useLocation();
	const { name, email } = location.state || { name: "Jane Doe", email: "jane.doe@gmail.com" };

	// Filter logs by action or IP
	const filteredLogs = useMemo(() => {
		if (!searchQuery.trim()) return activityLogs;
		const query = searchQuery.toLowerCase();
		return activityLogs.filter(
			log =>
				log.actionType.toLowerCase().includes(query) ||
				log.actionDescription.toLowerCase().includes(query) ||
				log.ipAddress.toLowerCase().includes(query),
		);
	}, [activityLogs, searchQuery]);

	const sortedLogs = useMemo(() => {
		const sorted = [...filteredLogs].sort((a, b) => {
			const { key, direction } = sortConfig;
			let valA = a[key];
			let valB = b[key];

			// Special handling for timestamp (date string)
			if (key === "timestamp") {
				const dateA = new Date(valA as string).getTime();
				const dateB = new Date(valB as string).getTime();
				return direction === "asc" ? dateA - dateB : dateB - dateA;
			}

			if (typeof valA === "string" && typeof valB === "string") {
				valA = valA.toLowerCase();
				valB = valB.toLowerCase();
			}
			if (valA < valB) return direction === "asc" ? -1 : 1;
			if (valA > valB) return direction === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [filteredLogs, sortConfig]);

	const displayedLogs = useMemo(() => sortedLogs.slice(startIdx, endIdx), [sortedLogs, startIdx, endIdx]);

	// Checkbox logic
	const allChecked = displayedLogs.length > 0 && displayedLogs.every(log => selectedLogs.includes(log.id));
	const isIndeterminate =
		displayedLogs.length > 0 && selectedLogs.some(id => displayedLogs.some(log => log.id === id)) && !allChecked;

	const handleSelectAll = () => {
		if (allChecked) {
			const pageIds = displayedLogs.map(log => log.id);
			setSelectedLogs(prev => prev.filter(id => !pageIds.includes(id)));
		} else {
			const pageIds = displayedLogs.map(log => log.id);
			setSelectedLogs(prev => [...new Set([...prev, ...pageIds])]);
		}
	};

	const handleCheckbox = (id: number) => {
		if (selectedLogs.includes(id)) {
			setSelectedLogs(prev => prev.filter(logId => logId !== id));
		} else {
			setSelectedLogs(prev => [...prev, id]);
		}
	};

	const handleSort = (key: SortKey) => {
		setSortConfig(prev => ({
			key,
			direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
		}));
	};

	// Reset to page 1 when searchQuery changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery]);

	const isSideExpanded = useAppState(state => state.isSideExpanded);

	return (
		<div
			className={`${
				isSideExpanded ? "w-full sm:w-[calc(100vw-385px)]" : "w-full sm:w-[calc(100vw-163px)]"
			} flex flex-col items-start gap-6 p-2.5 sm:p-6 bg-bgc dark:bg-fgcDark rounded-[10px] sm:rounded-[20px]`}>
			<div className="flex flex-col items-center justify-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
				<div className="flex sm:h-14 items-center w-full">
					<div className="relative font-medium text-text dark:text-textDark  text-sm sm:text-base tracking-[0] sm:leading-6 whitespace-nowrap">
						<Link to="/user-management" className="text-textSecondary dark:text-textDark">
							{"User Management > "}
						</Link>
						Activity Log
					</div>
				</div>
				<div className="flex flex-col sm:flex-row sm:items-center justify-around gap-3 p-2.5 sm:px-6 sm:py-4 relative self-stretch w-full bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
					<div className="flex flex-1/2 items-baseline gap-1">
						<div className="relative font-medium text-text dark:text-textDark text-lg sm:text-2xl whitespace-nowrap">
							{name}
						</div>
						<div className="text-text dark:text-textDark text-xs sm:text-xl">({email})</div>
					</div>
					<div className="flex flex-1/2 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-4 relative w-full">
						<div className="flex items-center gap-3 relative w-full">
							<div className="flex items-center w-full">
								<Icon
									icon="search"
									className="w-5 h-5 sm:w-6 sm:h-6 dark:text-textDark text-text shrink-0  absolute left-2.5 sm:left-3.5  z-10"
								/>
								<Input
									className="font-normal !pl-[35px] sm:!pl-[50px] !h-[42px] sm:!h-[56px] text-bgcSecondary dark:text-textDark text-sm whitespace-nowrap border-[none] !p-0 !outline-0 !ring-0 !self-stretch  !bg-fgc dark:!bg-fgcDark "
									placeholder="Search by action or IP"
									type="text"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className="flex items-center justify-center w-[42px] h-[42px] sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden border border-solid border-textSecondary/50">
								<Icon
									icon="filter-user"
									className="w-5 h-5 sm:w-6 sm:h-6  text-textSecondary dark:text-textDark"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full items-start gap-4 p-4 relative bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				<div className="flex items-center justify-between w-full">
					<div className="text-base sm:text-xl font-medium text-text dark:text-textDark">Activity Log</div>
					<div className="text-xs sm:text-base text-textSecondary dark:text-textDark">
						{selectedLogs.length === 0
							? "0 logs selected"
							: `${selectedLogs.length} log${selectedLogs.length > 1 ? "s" : ""} selected`}
					</div>
				</div>
				<div className="w-full overflow-x-auto overflow-hidden">
					<div className="flex flex-col items-start gap-2 relative self-stretch min-w-[800px] sm:min-w-[1450px] w-full flex-[0_0_auto] min-h-[500px] sm:min-h-[700px]">
						{/* Table header */}
						<div className="flex h-[42px] sm:h-[52px] items-start sm:justify-between relative self-stretch w-full bg-fgc dark:bg-fgcDark rounded-xl">
							{/* Checkbox header */}
							<div className="inline-flex flex-col items-start justify-center gap-2.5 px-4 py-3.5 relative self-stretch flex-[0_0_auto]">
								<label className="relative w-6 h-6 flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={allChecked}
										ref={el => {
											if (el) el.indeterminate = isIndeterminate;
										}}
										onChange={handleSelectAll}
										className="opacity-0 absolute w-6 h-6 cursor-pointer bg-transparent"
									/>
									<span
										className={`w-[17px] h-[17px] rounded-[2px] border border-textSecondary flex items-center justify-center transition-colors duration-150 ${
											allChecked || isIndeterminate
												? "bg-primary !border-primary "
												: "bg-transparent "
										}`}>
										{(allChecked || isIndeterminate) && (
											<Icon
												icon="check"
												className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0 mt-0.5 sm:ml-0.5"
											/>
										)}
									</span>
								</label>
							</div>
							{/* Sortable columns */}
							<div
								className="flex w-[148px] sm:w-[300px] items-center gap-1 sm:gap-2 px-1.5 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSort("timestamp")}>
								<div className="relative font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Timestamp
								</div>
								<Icon
									icon={
										sortConfig.key === "timestamp"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${
										sortConfig.key === "timestamp" && sortConfig.direction === "desc"
											? "rotate-180"
											: ""
									}`}
								/>
							</div>
							<div
								className="flex w-[150px] sm:w-[259px] items-center gap-1 sm:gap-2 px-0 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSort("actionType")}>
								<div className="relative font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Action Type
								</div>
								<Icon
									icon={
										sortConfig.key === "actionType"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${
										sortConfig.key === "actionType" && sortConfig.direction === "desc"
											? "rotate-180"
											: ""
									}`}
								/>
							</div>
							<div
								className="flex items-center w-[181px] sm:w-auto gap-1 sm:gap-2  px-0 sm:px-5 py-3.5 relative sm:flex-1 self-stretch sm:grow cursor-pointer"
								onClick={() => handleSort("actionDescription")}>
								<div className="font-medium relative text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Action Description
								</div>
								<Icon
									icon={
										sortConfig.key === "actionDescription"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${
										sortConfig.key === "actionDescription" && sortConfig.direction === "desc"
											? "rotate-180"
											: ""
									}`}
								/>
							</div>
							<div
								className="flex w-[108px] sm:w-[259px] items-center gap-1 sm:gap-2 px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSort("ipAddress")}>
								<div className="relative font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									IP Address
								</div>
								<Icon
									icon={
										sortConfig.key === "ipAddress"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${
										sortConfig.key === "ipAddress" && sortConfig.direction === "desc"
											? "rotate-180"
											: ""
									}`}
								/>
							</div>
							<div
								className="flex items-center w-[139px] sm:w-auto gap-1 sm:gap-2  px-5 py-3.5 relative sm:flex-1 self-stretch sm:grow cursor-pointer"
								onClick={() => handleSort("deviceInfo")}>
								<div className="relative font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Device Info
								</div>
								<Icon
									icon={
										sortConfig.key === "deviceInfo"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${
										sortConfig.key === "deviceInfo" && sortConfig.direction === "desc"
											? "rotate-180"
											: ""
									}`}
								/>
							</div>
						</div>
						{/* Table rows */}
						<>
							{displayedLogs.length === 0 ? (
								<div className="w-full flex items-center justify-center py-11">
									<span className="text-textSecondary dark:text-textDark text-base sm:text-lg">
										No data found
									</span>
								</div>
							) : (
								displayedLogs.map((log, idx) => (
									<React.Fragment key={log.id}>
										<div className="flex h-8 sm:h-11 items-start justify-between relative self-stretch w-full">
											{/* Checkbox */}
											<div className="inline-flex flex-col items-start justify-center gap-2.5 px-4 py-3.5 relative self-stretch flex-[0_0_auto]">
												<label className="relative w-6 h-6 flex items-center cursor-pointer">
													<input
														type="checkbox"
														checked={selectedLogs.includes(log.id)}
														onChange={() => handleCheckbox(log.id)}
														className="opacity-0 absolute w-6 h-6 cursor-pointer"
													/>
													<span
														className={`w-[17px] h-[17px] rounded-[2px] border border-textSecondary flex items-center justify-center transition-colors duration-150 ${
															selectedLogs.includes(log.id)
																? "bg-primary !border-primary "
																: "bg-transparent"
														}`}>
														{selectedLogs.includes(log.id) && (
															<Icon
																icon="check"
																className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0 mt-0.5 sm:ml-0.5"
															/>
														)}
													</span>
												</label>
											</div>
											{/* Timestamp */}
											<div className="flex w-[148px] sm:w-[300px] items-center gap-2.5 sm:px-5 sm:py-4 relative self-stretch">
												<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													{log.timestamp}
												</div>
											</div>
											{/* Action Type */}
											<div className="flex flex-col w-[168px] sm:w-[259px] items-start justify-center gap-2.5 sm:px-5 sm:py-4 relative self-stretch">
												<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													{log.actionType}
												</div>
											</div>
											{/* Action Description */}
											<div className="flex flex-col items-start justify-center gap-2.5 sm:px-5 sm:py-4 relative w-[181px] sm:w-auto  sm:flex-1 self-stretch sm:grow">
												<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													{log.actionDescription}
												</div>
											</div>
											{/* IP Address */}
											<div className="w-[108px] sm:w-[259px] flex flex-col items-start justify-center gap-2.5 sm:px-5 sm:py-4 relative self-stretch">
												<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													{log.ipAddress}
												</div>
											</div>
											{/* Device Info */}
											<div className="flex flex-col items-start justify-center gap-2.5 sm:px-5 sm:py-4 relative w-[139px] sm:w-auto sm:flex-1 self-stretch sm:grow">
												<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													{log.deviceInfo}
												</div>
											</div>
										</div>
										{idx < displayedLogs.length - 1 && (
											<div className="w-full h-px bg-textSecondary/10 dark:bg-textSecondary/25 shrink-0" />
										)}
									</React.Fragment>
								))
							)}
						</>
					</div>
				</div>
				{/* Pagination */}
				<div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2.5 relative flex-[0_0_auto]">
					<div className="w-full flex items-center">
						<span className="text-xs sm:text-sm text-textSecondary">
							{filteredLogs.length === 0
								? "Showing 0 of 0 users"
								: `Showing ${startIdx + 1}–${Math.min(endIdx, filteredLogs.length)} of ${filteredLogs.length} users`}
						</span>
					</div>
					{filteredLogs.length !== 0 && (
						<Pagination
							totalRecords={filteredLogs.length}
							recordsPerPage={recordsPerPage}
							currentPage={currentPage}
							handlePageChange={setCurrentPage}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
