import AddEditWeatherPopup from "components/popup/AddEditWeatherPopup";
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

interface WeatherCondition {
	id: number;
	location: string;
	effectiveFrom: any;
	temp: string;
	sky: string;
	wind: string;
	precipitation: number;
	status: string;
	statusColor: string;
	skyIcon: string;
}

interface SortConfig {
	key: keyof WeatherCondition;
	direction: "asc" | "desc";
}

export default function OverrideWeatherInfoPage() {
	// Example user data array with duplicates removed
	const [popupMode, setPopupMode] = useState("");
	const [weatherCondition, setWeatherCondition] = useState<WeatherCondition[]>([
		{
			id: 1,
			location: "New York, NY",
			effectiveFrom: "Jun 9, 10:00 AM – 6:00 PM",
			temp: "32°C / 22°C",
			sky: "Clear",
			wind: "12 km/h NE",
			precipitation: 10,
			status: "Active",
			statusColor: "text-textGreen",
			skyIcon: "Sunny",
		}, {
			id: 2,
			location: "San Francisco, CA",
			effectiveFrom: "Jun 10, 8:00 AM – 4:00 PM",
			temp: "24°C / 16°C",
			sky: "Cloudy",
			wind: "8 km/h W",
			precipitation: 5,
			status: "Inactive",
			statusColor: "text-textRed",
			skyIcon: "Cloud Cover",
		}, {
			id: 3,
			location: "Miami, FL",
			effectiveFrom: "Jun 9, 2:00 PM – 8:00 PM",
			temp: "35°C / 27°C",
			sky: "Clear",
			wind: "20 km/h SE",
			precipitation: 90,
			status: "Active",
			statusColor: "text-textGreen",
			skyIcon: "Sunny",
		}, {
			id: 4,
			location: "Seattle, WA",
			effectiveFrom: "Jun 11, 9:00 AM – 5:00 PM",
			temp: "20°C / 14°C",
			sky: "Rainy",
			wind: "10 km/h NW",
			precipitation: 70,
			status: "Inactive",
			statusColor: "text-textRed",
			skyIcon: "rain",
		}, {
			id: 5,
			location: "Austin, TX",
			effectiveFrom: "Jun 12, 12:00 PM – 6:00 PM",
			temp: "38°C / 26°C",
			sky: "Clear",
			wind: "15 km/h S",
			precipitation: 5,
			status: "Active",
			statusColor: "text-textGreen",
			skyIcon: "Sunny",
		}, {
			id: 6,
			location: "Denver, CO",
			effectiveFrom: "Jun 13, 8:00 AM – 3:00 PM",
			temp: "25°C / 12°C",
			sky: "Partly Cloudy",
			wind: "18 km/h W",
			precipitation: 15,
			status: "Active",
			statusColor: "text-textGreen",
			skyIcon: "Partly Cloudy",
		}, {
			id: 7,
			location: "Chicago, IL",
			effectiveFrom: "Jun 9, 6:00 AM – 2:00 PM",
			temp: "28°C / 18°C",
			sky: "Cloudy",
			wind: "14 km/h E",
			precipitation: 20,
			status: "Active",
			statusColor: "text-textGreen",
			skyIcon: "Cloud Cover",
		}, {
			id: 8,
			location: "Phoenix, AZ",
			effectiveFrom: "Jun 14, 10:00 AM – 7:00 PM",
			temp: "42°C / 30°C",
			sky: "Clear",
			wind: "8 km/h NE",
			precipitation: 0,
			status: "Inactive",
			statusColor: "text-textRed",
			skyIcon: "Sunny",
		}, {
			id: 9,
			location: "Boston, MA",
			effectiveFrom: "Jun 10, 7:00 AM – 5:00 PM",
			temp: "26°C / 17°C",
			sky: "Rainy",
			wind: "16 km/h N",
			precipitation: 60,
			status: "Active",
			statusColor: "text-textGreen",
			skyIcon: "rain",
		}, {
			id: 10,
			location: "Las Vegas, NV",
			effectiveFrom: "Jun 15, 2:00 PM – 9:00 PM",
			temp: "41°C / 29°C",
			sky: "Clear",
			wind: "10 km/h SW",
			precipitation: 2,
			status: "Inactive",
			statusColor: "text-textRed",
			skyIcon: "Sunny",
		}, {
			id: 11,
			location: "Portland, OR",
			effectiveFrom: "Jun 12, 5:00 AM – 1:00 PM",
			temp: "22°C / 13°C",
			sky: "Rainy",
			wind: "12 km/h W",
			precipitation: 65,
			status: "Active",
			statusColor: "text-textGreen",
			skyIcon: "rain",
		}, {
			id: 12,
			location: "Atlanta, GA",
			effectiveFrom: "Jun 11, 3:00 PM – 10:00 PM",
			temp: "31°C / 21°C",
			sky: "Partly Cloudy",
			wind: "13 km/h SE",
			precipitation: 30,
			status: "Active",
			statusColor: "text-textGreen",
			skyIcon: "Partly Cloudy",
		}, {
			id: 13,
			location: "Austin, TX",
			effectiveFrom: "Jun 12, 12:00 PM – 6:00 PM",
			temp: "38°C / 26°C",
			sky: "Clear",
			wind: "15 km/h S",
			precipitation: 50,
			status: "Active",
			statusColor: "text-textGreen",
			skyIcon: "Sunny",
		}, {
			id: 14,
			location: "Denver, CO",
			effectiveFrom: "Jun 13, 8:00 AM – 3:00 PM",
			temp: "25°C / 12°C",
			sky: "Partly Cloudy",
			wind: "18 km/h W",
			precipitation: 75,
			status: "Active",
			statusColor: "text-textGreen",
			skyIcon: "Sunny",
		}, {
			id: 15,
			location: "Chicago, IL",
			effectiveFrom: "Jun 9, 6:00 AM – 2:00 PM",
			temp: "28°C / 18°C",
			sky: "Cloudy",
			wind: "14 km/h E",
			precipitation: 80,
			status: "Active",
			statusColor: "text-textGreen",
			skyIcon: "Cloud Cover",
		},

	])

	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [usersPerPage] = useState(12);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "effectiveFrom",
		direction: "asc",
	});
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [isAddEditUserPopupOpen, setIsAddEditUserPopupOpen] = useState(false);
	const isSideExpanded = useAppState(state => state.isSideExpanded);

	const startIdx = (currentPage - 1) * usersPerPage;
	const endIdx = Math.min(startIdx + usersPerPage, weatherCondition.length);

	const [isDeleteUserPopupOpen, setIsDeleteUserPopupOpen] = useState(false);
	const [deleteUserIndex, setDeleteUserIndex] = useState<number | null>(null);

	const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
	const [resetUserEmail, setResetUserEmail] = useState<string>("");
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState("");

	// Filter users by search query (name or email)
	const filteredUsers = useMemo(() => {
		if (!searchQuery.trim()) return weatherCondition;
		const query = searchQuery.toLowerCase();
		return weatherCondition.filter(
			weather => weather.location.toLowerCase().includes(query) || weather.sky.toLowerCase().includes(query),
		);
	}, [weatherCondition, searchQuery]);

	const sortedUsers = useMemo(() => {
		const sorted = [...filteredUsers].sort((a: WeatherCondition, b: WeatherCondition) => {
			const key = sortConfig.key;
			let valA = a[key];
			let valB = b[key];

			if (typeof valA === "string" && typeof valB === "string") {
				if (key === "effectiveFrom") {
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
	}, [filteredUsers, sortConfig]);

	const displayedUsers = useMemo(() => {
		return sortedUsers.slice(startIdx, endIdx);
	}, [sortedUsers, startIdx, endIdx]);

	const handleSort = (key: keyof WeatherCondition) => {
		setSortConfig(prevConfig => ({
			key,
			direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
		}));
	};

	/* Start for checkbox */
	const allChecked = displayedUsers.length > 0 && displayedUsers.every((u: WeatherCondition) => selectedUsers.includes(u.id));
	const isIndeterminate =
		displayedUsers.length > 0 && selectedUsers.some(id => displayedUsers.some(u => u.id === id)) && !allChecked;

	const handleSelectAll = () => {
		if (allChecked) {
			const pageIds = displayedUsers.map((u: WeatherCondition) => u.id);
			setSelectedUsers(prev => prev.filter(id => !pageIds.includes(id)));
		} else {
			const pageIds = displayedUsers.map((u: WeatherCondition) => u.id);
			setSelectedUsers(prev => [...new Set([...prev, ...pageIds])]);
		}
	};

	const handleCheckbox = (id: number) => {
		if (selectedUsers.includes(id)) {
			setSelectedUsers(prev => prev.filter(userId => userId !== id));
		} else {
			setSelectedUsers(prev => [...prev, id]);
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
						Override Weather Info
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
									setIsAddEditUserPopupOpen(true);
									setPopupMode("")
								}}>
								<Icon icon="plus" className="w-5 h-5 sm:w-7 sm:h-7" />
								<div className="relative  font-semibold text-text text-xs sm:text-base tracking-[0] leading-6 whitespace-nowrap">
									Add New Weather Condition
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
						Weather Condition List
					</div>
					<div className="text-xs sm:text-base text-textSecondary dark:text-textDark leading-[21px] sm:leading-[26px]">
						{selectedUsers.length === 0
							? "0 selected"
							: `${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""} selected`}
					</div>
				</div>
				<div className="w-full overflow-x-auto overflow-hidden">
					<div className="flex flex-col items-start gap-[5.54px] sm:gap-[7.54px] relative self-stretch min-w-[980px] sm:min-w-[1450px] w-full flex-[0_0_auto] min-h-[500px] sm:min-h-[700px]">
						<div className="flex h-[42px] sm:h-[52px] items-start sm:justify-between relative self-stretch w-full bg-fgc dark:bg-fgcDark rounded-xl">
							{/* Column headers */}
							<div className="inline-flex flex-col items-start justify-center gap-2.5 px-[11px] sm:px-4 py-3.5 relative self-stretch flex-[0_0_auto]">
								<label className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center cursor-pointer">
									<input
										type="checkbox"
										checked={allChecked}
										ref={el => {
											if (el) el.indeterminate = isIndeterminate;
										}}
										onChange={handleSelectAll}
										className="opacity-0 absolute w-5 h-5 sm:w-6 sm:h-6 cursor-pointer bg-transparent"
									/>
									<span
										className={`w-[17px] h-[17px] rounded-[2px] border border-textSecondary flex items-center justify-center transition-colors duration-150 ${allChecked || isIndeterminate
											? "bg-primary !border-primary "
											: "bg-transparent "
											}`}>
										{(allChecked || isIndeterminate) && (
											<Icon
												icon="check"
												className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-[1px] mt-0.5 sm:ml-0.5"
											/>
										)}
									</span>
								</label>
							</div>
							<div
								className="flex w-[125px] sm:w-[200px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
							// onClick={() => handleSort("location")}
							>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Location
								</div>
								{/* <Icon
									icon={
										sortConfig?.key === "location"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/> */}
							</div>
							<div
								className="flex w-[171px] sm:w-[232px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSort("effectiveFrom")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Effective From
								</div>
								<Icon
									icon={
										sortConfig?.key === "effectiveFrom"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div className="flex items-center w-[135px] sm:w-auto gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative sm:flex-1 self-stretch sm:grow"
								onClick={() => handleSort("temp")}
							>
								<div className="font-medium relative text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Temp(High/Low)
								</div>
								<Icon
									icon={
										sortConfig?.key === "temp"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div
								className="flex w-[121px] sm:w-[152px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSort("sky")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Sky
								</div>
								<Icon
									icon={
										sortConfig?.key === "sky"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div
								className="flex items-center w-[88px] sm:w-auto gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative sm:flex-1 self-stretch sm:grow cursor-pointer">
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Wind
								</div>
							</div>
							<div
								className="flex items-center gap-1 sm:gap-2 w-[122px] sm:w-auto px-3 sm:px-5 py-3.5 relative sm:flex-1 self-stretch sm:grow cursor-pointer"
								onClick={() => handleSort("precipitation")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Precipitation
								</div>
								<Icon
									icon={
										sortConfig?.key === "precipitation"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div
								className="flex w-[96.5px] sm:w-[124px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSort("status")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Status
								</div>
								<Icon
									icon={
										sortConfig?.key === "status"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div className="inline-flex flex-col items-center w-[72px] sm:w-auto justify-center gap-2.5 px-3 sm:px-5 py-3.5 relative self-stretch flex-[0_0_auto]">
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Actions
								</div>
							</div>
						</div>

						{/* Render user rows dynamically */}
						<>
							{displayedUsers.length === 0 ? (
								<div className="w-full flex items-center justify-center py-11">
									<span className="text-textSecondary dark:text-textDark text-base sm:text-lg">
										No data found
									</span>
								</div>
							) : (
								displayedUsers.map((item, idx) => {
									console.log("item", item)
									const usersOnPage = displayedUsers.length;
									const isLastFour = usersOnPage >= 7 && idx >= usersOnPage - 4;
									const menuPositionClass = isLastFour
										? "origin-bottom-right bottom-full mb-2.5 sm:mb-[17px]"
										: "origin-top-right top-full mt-2.5 sm:mt-[17px]";
									return (
										<React.Fragment key={item.id}>
											<div className="flex h-8 sm:h-11 items-start  relative self-stretch w-full">
												{/* Checkbox */}
												<div className="inline-flex flex-col items-start justify-center gap-2.5 px-[9px] sm:px-4 py-3.5 relative self-stretch flex-[0_0_auto]">
													<label className="relative w-6 h-6 flex items-center justify-center cursor-pointer">
														<input
															type="checkbox"
															checked={selectedUsers.includes(item.id)}
															onChange={() => handleCheckbox(item.id)}
															className="opacity-0 absolute w-5 h-5 sm:w-6 sm:h-6 cursor-pointer bg-transparent"
														/>
														<span
															className={`w-[17px] h-[17px] rounded-[2px] border border-textSecondary flex items-center justify-center transition-colors duration-150 ${selectedUsers.includes(item.id)
																? "bg-primary !border-primary"
																: "bg-transparent"
																}`}>
															{selectedUsers.includes(item.id) && (
																<Icon
																	icon="check"
																	className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-[1px] mt-0.5 sm:ml-0.5	"
																/>
															)}
														</span>
													</label>
												</div>

												{/* Location */}
												<div className="flex w-[125px] sm:w-[200px] items-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{item.location}
													</div>
												</div>

												{/* EffectiveFrom */}
												<div className="flex flex-col w-[171px] sm:w-[232px] items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{typeof item.effectiveFrom === 'string'
															? item.effectiveFrom
															: `${item.effectiveFrom.startDate} – ${item.effectiveFrom.endDate}`}
													</div>
												</div>

												{/* temp */}
												<div className="flex flex-col w-[135px] sm:w-auto items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative sm:flex-1 self-stretch sm:grow">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{item.temp}
													</div>
												</div>

												{/* Sky */}
												<div className="flex w-[121px] sm:w-[152px] items-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="relative w-[18px] h-[18px] rounded-2xl">
														<img
															src={`/assets/images/${item.skyIcon}.svg`}
															alt="User Avatar"
															className="w-full h-full rounded-2xl object-cover"
														/>
													</div>
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{item.sky}
													</div>
												</div>

												{/* Wind */}
												<div className="flex flex-col items-start justify-center w-[88px] sm:w-auto gap-2.5 px-3 sm:px-5 sm:py-4 relative sm:flex-1 self-stretch sm:grow">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{item.wind}
													</div>
												</div>

												{/* Precipitation */}
												<div className="flex flex-col items-start justify-center w-[122px] sm:w-auto gap-2.5 px-3 sm:px-5 sm:py-4 relative sm:flex-1 self-stretch sm:grow">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{item.precipitation}%
													</div>
												</div>

												{/* Status */}
												<div className="w-[96.5px] sm:w-[124px] flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 gap-1 sm:gap-2">
													{/* Status text */}
													<div
														className={`font-normal ${item.statusColor} text-[10px] sm:text-base text-center tracking-[0] leading-[1.2] whitespace-nowrap`}
													>
														{item.status}
													</div>

													{/* Switch */}
													<div
														className="w-[26px] h-[16px] rounded-full flex items-center px-0.5 transition-all duration-300 bg-[#808080]"
													>
														<div
															className={`w-[14px] h-[14px] rounded-full transition-all duration-300 transform ${item.status === "Active"
																? "translate-x-[9px] bg-[#FFA500]"
																: "translate-x-[-1px] bg-[#F8F8F8]"
																}`}
														/>
													</div>
												</div>



												{/* Actions */}
												<div className="flex flex-col w-[72px] sm:w-[100px] items-center justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="inline-flex items-center justify-center gap-2 px-[7px] sm:p-2.5 bg-fgc dark:bg-fgcDark rounded-[4px] sm:rounded-lg cursor-pointer">
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
																leaveTo="transform scale-95 opacity-0">
																<Menu.Items
																	className={`absolute -right-5 w-[140px] sm:w-[163px] bg-fgc dark:bg-fgcDark rounded-xl focus:outline-none flex flex-col z-50 transition ${menuPositionClass}`}>
																	<div className="flex flex-col items-start px-3 py-2 sm:px-2.5 sm:py-2.5 gap-1">
																		<Menu.Item>
																			<div
																				className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																				onClick={() => {
																					const globalIndex = weatherCondition.findIndex(
																						u => u.id === item.id,
																					);
																					setEditIndex(globalIndex);
																					setIsAddEditUserPopupOpen(true);
																				}}>
																				Edit
																			</div>
																		</Menu.Item>
																		<Menu.Item>
																			<div
																				onClick={() => {
																					const globalIndex = weatherCondition.findIndex(
																						u => u.id === item.id,
																					);
																					setEditIndex(globalIndex);
																					setPopupMode("view");
																					setIsAddEditUserPopupOpen(true);
																				}}
																				className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full">
																				view
																			</div>
																		</Menu.Item>
																		<Menu.Item>
																			<div
																				className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																				onClick={() => {
																					setDeleteUserIndex(
																						weatherCondition.findIndex(
																							u => u.id === item.id,
																						),
																					);
																					setIsDeleteUserPopupOpen(true);
																				}}>
																				Delete
																			</div>
																		</Menu.Item>
																	</div>
																</Menu.Items>
															</Transition>
														</Menu>
													</div>
												</div>
											</div>

											{/* Divider */}
											{idx < displayedUsers.length - 1 && (
												<div className="w-full h-px bg-textSecondary/10 dark:bg-textSecondary/25 shrink-0" />
											)}
										</React.Fragment>
									);
								})
							)}
						</>
					</div>
				</div>
				{/* Pagination */}
				<div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 sm:py-2.5 relative flex-[0_0_auto]">
					<div className="w-full flex items-center">
						<span className="text-xs sm:text-sm text-textSecondary leading-[18px] sm:leading-[24px]">
							{filteredUsers.length === 0
								? "Showing 0 of 0 users"
								: `Showing ${startIdx + 1}–${Math.min(endIdx, filteredUsers.length)} of ${filteredUsers.length} users`}
						</span>
					</div>
					{filteredUsers.length !== 0 && (
						<Pagination
							totalRecords={filteredUsers.length}
							recordsPerPage={usersPerPage}
							currentPage={currentPage}
							handlePageChange={(page: number) => {
								setCurrentPage(page);
							}}
						/>
					)}
				</div>
			</div>
			<AddEditWeatherPopup
				isOpen={isAddEditUserPopupOpen}
				setIsOpen={() => {
					setEditIndex(null);
					setIsAddEditUserPopupOpen(false);
				}}
				list={weatherCondition}
				setList={setWeatherCondition}
				editIndex={editIndex}
				mode={popupMode}
				setMode={setPopupMode}
			/>
			<DeleteUserPopup
				isOpen={isDeleteUserPopupOpen}
				setIsOpen={setIsDeleteUserPopupOpen}
				user={
					deleteUserIndex !== null
						? { name: weatherCondition[deleteUserIndex].location }
						: null
				}
				itemType=" Weather Condition"
				onDelete={() => {
					if (deleteUserIndex !== null) {
						setWeatherCondition(prev => prev.filter((_, idx) => idx !== deleteUserIndex));
						setDeleteUserIndex(null);
						setIsDeleteUserPopupOpen(false);
						toast.success("User deleted successfully");
					}
				}}
			/>
		</div>
	);
}
