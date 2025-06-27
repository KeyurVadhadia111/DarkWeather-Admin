import AddEditWeatherAlertPopup from "components/popup/AddEditWeatherAlertPopup";
import { Menu, Transition } from "@headlessui/react";
import { Button } from "components/utils/Button";
import Icon from "components/utils/Icon";
import { Input } from "components/utils/Input";
import Pagination from "components/utils/Pagination";
import useAppState from "components/utils/useAppState";
import React, { useEffect, useMemo, useState } from "react";
import DeleteUserPopup from "components/popup/DeleteUserPopup";
import ResertPasswordPopup from "components/popup/ResertPasswordPopup";
import { useNavigate } from "react-router-dom";
import { toast } from "components/utils/toast";

interface weatherAlert {
	id: number;
	alert: string;
	location: string;
	severity: string;
	dueTo: string;
	startDateTime: string;
	endDateTime: string;
	status: string;
	statusColor: string;
}

interface SortConfig {
	key: keyof weatherAlert;
	direction: "asc" | "desc";
}

export default function WeatherAlertPage() {
	// Example Weather Alert data array with duplicates removed

	const [weatherAlert, setWeatherAlert] = useState<weatherAlert[]>([
		{
			id: 1,
			alert: "Flash Flood Warning",
			location: "New York, NY",
			severity: "High",
			dueTo: "Heavy rain causing possible flooding",
			startDateTime: "Jun 18, 2:00 PM",
			endDateTime: "Jun 18, 6:00 PM",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 2,
			alert: "Excessive Heat Alert",
			location: "San Francisco, CA",
			severity: "Extreme",
			dueTo: "Temperatures expected above 45°C",
			startDateTime: "Jun 19, 11:00 AM",
			endDateTime: "Jun 19, 7:00 PM",
			status: "Inactive",
			statusColor: "text-textRed",
		},
		{
			id: 3,
			alert: "Snowstorm Alert",
			location: "Miami, FL",
			severity: "Moderate",
			dueTo: "Light to moderate snowfall expected",
			startDateTime: "Jun 20, 6:00 AM",
			endDateTime: "Jun 20, 3:00 PM",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 4,
			alert: "Thunderstorm Warning",
			location: "Seattle, WA",
			severity: "High",
			dueTo: "Lightning & hailstorms possible",
			startDateTime: "Jun 18, 4:00 PM",
			endDateTime: "Jun 18, 9:00 PM",
			status: "Inactive",
			statusColor: "text-textRed",
		},
		{
			id: 5,
			alert: "Wind Advisory",
			location: "Austin, TX",
			severity: "Low",
			dueTo: "Winds reaching up to 40 km/h",
			startDateTime: "Jun 19, 9:00 AM",
			endDateTime: "Jun 19, 5:00 PM",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 6,
			alert: "Rainfall Alert",
			location: "Denver, CO",
			severity: "Moderate",
			dueTo: "Moderate rainfall in the area",
			startDateTime: "Jun 18, 8:00 AM",
			endDateTime: "Jun 18, 12:00 PM",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 7,
			alert: "Coastal Flood Watch",
			location: "Chicago, IL",
			severity: "High",
			dueTo: "Tidal flooding due to storm surge",
			startDateTime: "Jun 21, 2:00 AM",
			endDateTime: "Jun 21, 6:00 AM",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 8,
			alert: "Heat Warning",
			location: "Phoenix, AZ",
			severity: "Extreme",
			dueTo: "Health risk due to prolonged heat",
			startDateTime: "Jun 19, 12:00 PM",
			endDateTime: "Jun 19, 8:00 PM",
			status: "Inactive",
			statusColor: "text-textRed",
		},
		{
			id: 9,
			alert: "Ice Warning",
			location: "Boston, MA",
			severity: "Moderate",
			dueTo: "Icy road conditions expected",
			startDateTime: "Jun 20, 7:00 AM",
			endDateTime: "Jun 20, 11:00 AM",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 10,
			alert: "Tropical Storm Alert",
			location: "Las Vegas, NV",
			severity: "Extreme",
			dueTo: "Risk of tropical cyclone impact",
			startDateTime: "Jun 22, 3:00 PM",
			endDateTime: "Jun 22, 10:00 PM",
			status: "Inactive",
			statusColor: "text-textRed",
		},
		{
			id: 11,
			alert: "Dust Storm Warning",
			location: "Portland, OR",
			severity: "High",
			dueTo: "Reduced visibility due to dust storm",
			startDateTime: "Jun 18, 1:00 PM",
			endDateTime: "Jun 18, 4:00 PM",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 12,
			alert: "Thunderstorm Risk",
			location: "Atlanta, GA",
			severity: "Low",
			dueTo: "Low chance of isolated thunderstorms",
			startDateTime: "Jun 19, 5:00 PM",
			endDateTime: "Jun 19, 9:00 PM",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 13,
			alert: "Rainfall Alert",
			location: "Austin, TX",
			severity: "Moderate",
			dueTo: "Moderate rainfall in the area",
			startDateTime: "Jun 18, 8:00 AM",
			endDateTime: "Jun 18, 12:00 PM",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 14,
			alert: "Coastal Flood Watch",
			location: "Denver, CO",
			severity: "High",
			dueTo: "Tidal flooding due to storm surge",
			startDateTime: "Jun 21, 2:00 AM",
			endDateTime: "Jun 21, 6:00 AM",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 15,
			alert: "Heat Warning",
			location: "Chicago, IL",
			severity: "Extreme",
			dueTo: "Health risk due to prolonged heat",
			startDateTime: "Jun 19, 12:00 PM",
			endDateTime: "Jun 19, 8:00 PM",
			status: "Inactive",
			statusColor: "text-textRed",
		}
	]);
	const [selectedWeatherAlert, setSelectedWeatherAlert] = useState<number[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [weatherAlertPerPage] = useState(12);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "alert",
		direction: "asc",
	});
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [isAddEditWeatherAlertPopupOpen, setIsAddEditWeatherAlertPopupOpen] = useState(false);
	const isSideExpanded = useAppState(state => state.isSideExpanded);

	const startIdx = (currentPage - 1) * weatherAlertPerPage;
	const endIdx = Math.min(startIdx + weatherAlertPerPage, weatherAlert.length);

	const [isDeleteUserPopupOpen, setIsDeleteUserPopupOpen] = useState(false);
	const [deleteUserIndex, setDeleteUserIndex] = useState<number | null>(null);

	const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState("");

	// Filter weatherAlert by search query (name or email)
	const filteredWeatherAlert = useMemo(() => {
		if (!searchQuery.trim()) return weatherAlert;
		const query = searchQuery.toLowerCase();
		return weatherAlert.filter(
			weather => weather.alert.toLowerCase().includes(query) || weather.severity.toLowerCase().includes(query),
		);
	}, [weatherAlert, searchQuery]);

	const sortedWeatherAlert = useMemo(() => {
		const sorted = [...filteredWeatherAlert].sort((a: weatherAlert, b: weatherAlert) => {
			const key = sortConfig.key;
			let valA = a[key];
			let valB = b[key];

			if (typeof valA === "string" && typeof valB === "string") {
				if (key === "startDateTime") {
					const convertToDate = (str: string): number => {
						if (str.toLowerCase().includes("today")) return new Date().getTime();
						if (str.toLowerCase().includes("yesterday")) {
							const date = new Date();
							date.setDate(date.getDate() - 1);
							return date.getTime();
						}
						return new Date(str).getTime();
					};
					return sortConfig.direction === "asc"
						? convertToDate(valA) - convertToDate(valB)
						: convertToDate(valB) - convertToDate(valA);
				}
				valA = valA.toLowerCase();
				valB = valB.toLowerCase();
			}

			if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
			if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [filteredWeatherAlert, sortConfig]);

	const displayedWeatherAlert = useMemo(() => {
		return sortedWeatherAlert.slice(startIdx, endIdx);
	}, [sortedWeatherAlert, startIdx, endIdx]);

	const handleSort = (key: keyof weatherAlert) => {
		setSortConfig(prevConfig => ({
			key,
			direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
		}));
	};

	/* Start for checkbox */
	const allChecked = displayedWeatherAlert.length > 0 && displayedWeatherAlert.every((u: weatherAlert) => selectedWeatherAlert.includes(u.id));
	const isIndeterminate =
		displayedWeatherAlert.length > 0 && selectedWeatherAlert.some(id => displayedWeatherAlert.some(u => u.id === id)) && !allChecked;

	const handleSelectAll = () => {
		if (allChecked) {
			const pageIds = displayedWeatherAlert.map((u: weatherAlert) => u.id);
			setSelectedWeatherAlert(prev => prev.filter(id => !pageIds.includes(id)));
		} else {
			const pageIds = displayedWeatherAlert.map((u: weatherAlert) => u.id);
			setSelectedWeatherAlert(prev => [...new Set([...prev, ...pageIds])]);
		}
	};

	const handleCheckbox = (id: number) => {
		if (selectedWeatherAlert.includes(id)) {
			setSelectedWeatherAlert(prev => prev.filter(weatherId => weatherId !== id));
		} else {
			setSelectedWeatherAlert(prev => [...prev, id]);
		}
	};
	/* End for checkbox */

	// Reset to page 1 when searchQuery changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery]);

	return (
		<div
			className={`${isSideExpanded ? "w-full sm:w-[calc(100vw-385px)]" : "w-full sm:w-[calc(100vw-163px)]"} flex flex-col items-start gap-5 sm:gap-6 p-2.5 sm:p-6 bg-bgc dark:bg-fgcDark rounded-[10px] sm:rounded-[20px]`}>
			{/* ...header and search/filter UI... */}
			<div className="flex flex-col items-center justify-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
				<div className="flex sm:h-14 items-center w-full">
					<div className="relative font-medium text-text dark:text-textDark text-xl sm:text-2xl tracking-[0] leading-5 sm:leading-6 whitespace-nowrap">
						Weather Alert
					</div>
				</div>
				<div className="flex items-center justify-around gap-3 p-2.5 sm:px-6 sm:py-4 relative self-stretch w-full flex-[0_0_auto] bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-4 relative flex-1 grow w-full">
						<div className="flex items-center gap-3 relative w-full md:w-1/2">
							<div className="flex items-center w-full">
								<Icon
									icon="search"
									className="w-5 h-5 sm:w-6 sm:h-6 dark:text-textDark text-text shrink-0  absolute left-2.5 sm:left-3.5  z-10"
								/>
								<Input
									className="font-normal !pl-[35px] sm:!pl-[50px] !h-[42px] sm:!h-[56px] text-bgcSecondary dark:text-textDark text-sm whitespace-nowrap border-[none] !p-0 !outline-0 !ring-0 !self-stretch  !bg-fgc dark:!bg-fgcDark "
									placeholder="Search here..."
									type="text"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className="flex items-center justify-center w-[42px] h-[42px] sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden border border-solid border-textSecondary/50 shrink-0">
								<Icon
									icon="filter-user"
									className="w-5 h-5 sm:w-6 sm:h-6  text-textSecondary dark:text-textDark"
								/>
							</div>
						</div>
						<div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
							<Button
								className="flex h-[42px] sm:h-14 items-center justify-center gap-3 sm:px-6 py-3 sm:py-4 relative flex-[0_0_auto] bg-primary rounded-lg sm:rounded-xl"
								onClick={() => {
									setEditIndex(null);
									setIsAddEditWeatherAlertPopupOpen(true);
								}}>
								<Icon icon="plus" className="w-5 h-5 sm:w-7 sm:h-7" />
								<div className="relative  font-semibold text-text text-xs sm:text-base tracking-[0] leading-6 whitespace-nowrap">
									Add New Weather Alert
								</div>
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full items-start gap-4 p-4 relative bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				{/* ...table header... */}
				<div className="flex items-center justify-between w-full">
					<div className="text-base sm:text-xl font-medium text-text dark:text-textDark leading-[21px] sm:leading-[26px]">
						weather Alert
					</div>
					<div className="text-xs sm:text-base text-textSecondary dark:text-textDark leading-[21px] sm:leading-[26px]">
						{selectedWeatherAlert.length === 0
							? "0 Weather Alert selected"
							: `${selectedWeatherAlert.length} Weather Alert${selectedWeatherAlert.length > 1 ? "s" : ""} selected`}
					</div>
				</div>
				<div className="w-full overflow-x-auto overflow-hidden">
					<table className="min-w-[1027px] sm:min-w-[1450px] w-full text-left border-separate border-spacing-0">
						<thead>
							<tr className="h-[42px] sm:h-[52px] bg-fgc dark:bg-fgcDark rounded-xl">
								<th className="px-[11px] sm:px-4 py-3.5">
									<label className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center cursor-pointer">
										<input
											type="checkbox"
											checked={allChecked}
											ref={(el) => {
												if (el) el.indeterminate = isIndeterminate;
											}}
											onChange={handleSelectAll}
											className="opacity-0 absolute w-5 h-5 sm:w-6 sm:h-6 cursor-pointer bg-transparent"
										/>
										<span
											className={`w-[17px] h-[17px] rounded-[2px] border border-textSecondary flex items-center justify-center transition-colors duration-150 ${allChecked || isIndeterminate
												? "bg-primary !border-primary"
												: "bg-transparent"
												}`}
										>
											{(allChecked || isIndeterminate) && (
												<Icon
													icon="check"
													className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-[1px] mt-0.5 sm:ml-0.5"
												/>
											)}
										</span>
									</label>
								</th>
								<th className="w-[152px] sm:w-[220px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("alert")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Alert</span>
										<Icon
											icon={sortConfig?.key === "alert" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[132px] sm:w-[180px] px-3 sm:px-5 py-3.5">
									<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Location</span>
								</th>
								<th className="w-[95px] sm:w-[140px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("severity")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Severity</span>
										<Icon
											icon={sortConfig?.key === "severity" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[227px] sm:w-auto px-3 sm:px-5 py-3.5">
									<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Due to</span>
								</th>
								<th className="w-[137px] sm:w-[180px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("startDateTime")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">
											Start Date Time
										</span>
										<Icon
											icon={sortConfig?.key === "startDateTime" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[129px] sm:w-[180px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("endDateTime")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">
											End Date Time
										</span>
										<Icon
											icon={sortConfig?.key === "endDateTime" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[96.5px] sm:w-[120px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("status")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Status</span>
										<Icon
											icon={sortConfig?.key === "status" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[72px] sm:w-auto px-3 sm:px-5 py-3.5">
									<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Actions</span>
								</th>
							</tr>
						</thead>

						<tbody>
							{displayedWeatherAlert.length === 0 ? (
								<tr>
									<td colSpan={9} className="text-center py-11 text-textSecondary dark:text-textDark text-base sm:text-lg">
										No data found
									</td>
								</tr>
							) : (
								displayedWeatherAlert.map((weather, idx) => {
									const isLastFour = displayedWeatherAlert.length >= 7 && idx >= displayedWeatherAlert.length - 4;
									const menuPositionClass = isLastFour
										? "origin-bottom-right bottom-full mb-2.5 sm:mb-[17px]"
										: "origin-top-right top-full mt-2.5 sm:mt-[17px]";
									return (
										<tr key={weather.id} className="h-8 sm:h-11">
											<td className="px-[9px] sm:px-4 py-3.5">
												<label className="relative w-6 h-6 flex items-center justify-center cursor-pointer">
													<input
														type="checkbox"
														checked={selectedWeatherAlert.includes(weather.id)}
														onChange={() => handleCheckbox(weather.id)}
														className="opacity-0 absolute w-5 h-5 sm:w-6 sm:h-6 cursor-pointer bg-transparent"
													/>
													<span
														className={`w-[17px] h-[17px] rounded-[2px] border border-textSecondary flex items-center justify-center transition-colors duration-150 ${selectedWeatherAlert.includes(weather.id)
															? "bg-primary !border-primary"
															: "bg-transparent"
															}`}
													>
														{selectedWeatherAlert.includes(weather.id) && (
															<Icon
																icon="check"
																className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-[1px] mt-0.5 sm:ml-0.5"
															/>
														)}
													</span>
												</label>
											</td>
											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{weather.alert}</td>
											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{weather.location}</td>
											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{weather.severity}</td>
											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base">
												<div className="truncate whitespace-nowrap overflow-hidden max-w-[250px]">
													{weather.dueTo}
												</div>
											</td>

											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{weather.startDateTime}</td>
											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{weather.endDateTime}</td>
											<td className="px-3 sm:px-5 py-4 text-xs sm:text-base whitespace-nowrap">
												<span className={`${weather.statusColor}`}>{weather.status}</span>
											</td>
											<td className="px-3 sm:px-5 py-4">
												<Menu as="div" className="relative inline-block text-left">
													<Menu.Button>
														<Icon
															icon="action-icon"
															className="w-[11px] h-[11px] sm:w-5 sm:h-5 text-textSecondary dark:text-textDark"
														/>
													</Menu.Button>

													<Transition
														enter="transition ease-out duration-100"
														enterFrom="transform scale-95 opacity-0"
														enterTo="transform scale-100 opacity-100"
														leave="transition ease-in duration-75"
														leaveFrom="transform scale-100 opacity-100"
														leaveTo="transform scale-95 opacity-0"
													>
														<Menu.Items
															className={`absolute -right-5 w-[140px] sm:w-[163px] bg-fgc dark:bg-fgcDark rounded-xl focus:outline-none flex flex-col z-50 transition ${menuPositionClass}`}
														>
															<div className="flex flex-col items-start px-3 py-2 sm:px-2.5 sm:py-2.5 gap-1">
																<Menu.Item>
																	<div
																		className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																		onClick={() => {
																			const globalIndex = weatherAlert.findIndex((u) => u.id === weather.id);
																			setEditIndex(globalIndex);
																			setIsAddEditWeatherAlertPopupOpen(true);
																		}}
																	>
																		Edit
																	</div>
																</Menu.Item>
																<Menu.Item>
																	<div
																		className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																		onClick={() => {
																			setDeleteUserIndex(weatherAlert.findIndex((u) => u.id === weather.id));
																			setIsDeleteUserPopupOpen(true);
																		}}
																	>
																		Delete
																	</div>
																</Menu.Item>
															</div>
														</Menu.Items>
													</Transition>
												</Menu>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 sm:py-2.5 relative flex-[0_0_auto]">
					<div className="w-full flex items-center">
						<span className="text-xs sm:text-sm text-textSecondary leading-[18px] sm:leading-[24px]">
							{filteredWeatherAlert.length === 0
								? "Showing 0 of 0 Weather Alert"
								: `Showing ${startIdx + 1}–${Math.min(endIdx, filteredWeatherAlert.length)} of ${filteredWeatherAlert.length} Weather Alert`}
						</span>
					</div>
					{filteredWeatherAlert.length !== 0 && (
						<Pagination
							totalRecords={filteredWeatherAlert.length}
							recordsPerPage={weatherAlertPerPage}
							currentPage={currentPage}
							handlePageChange={(page: number) => {
								setCurrentPage(page);
							}}
						/>
					)}
				</div>
			</div>
			<AddEditWeatherAlertPopup
				isOpen={isAddEditWeatherAlertPopupOpen}
				setIsOpen={() => {
					setEditIndex(null);
					setIsAddEditWeatherAlertPopupOpen(false);
				}}
				list={weatherAlert}
				setList={setWeatherAlert}
				editIndex={editIndex}
			/>
			<DeleteUserPopup
				isOpen={isDeleteUserPopupOpen}
				setIsOpen={setIsDeleteUserPopupOpen}
				user={
					deleteUserIndex !== null
						? { name: weatherAlert[deleteUserIndex].alert }
						: null
				}
				itemType=" Weather Alert"
				onDelete={() => {
					if (deleteUserIndex !== null) {
						setWeatherAlert(prev => prev.filter((_, idx) => idx !== deleteUserIndex));
						setDeleteUserIndex(null);
						setIsDeleteUserPopupOpen(false);
						toast.success("User deleted successfully");
					}
				}}
			/>
		</div>
	);
}
