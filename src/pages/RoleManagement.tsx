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

interface Role {
	id: number;
	role: string;
	desc: string;
	totalUsers: number;
	status: string;
	statusColor: string;
}

interface SortConfig {
	key: keyof Role;
	direction: "asc" | "desc";
}

export default function RoleManagement() {
	// Example Weather Alert data array with duplicates removed

	const [weatherAlert, setWeatherAlert] = useState<Role[]>([
		{
			id: 1,
			role: "Super Admin",
			desc: "Stakeholders & Internal Team Leads",
			totalUsers: 3,
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 2,
			role: "Analytics",
			desc: "SEO and Marketing Analytics team",
			totalUsers: 21,
			status: "Inactive",
			statusColor: "text-textRed",
		},
		{
			id: 3,
			role: "Support",
			desc: "Customer Support & Back-office team",
			totalUsers: 16,
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 4,
			role: "Operations",
			desc: "IT & Infrastructure technical team",
			totalUsers: 32,
			status: "Inactive",
			statusColor: "text-textRed",
		},
		{
			id: 5,
			role: "Meteorologist",
			desc: "Lorem Ipsum is simply dummy text ",
			totalUsers: 12,
			status: "Active",
			statusColor: "text-textGreen",
		},
	]);
	const [selectedWeatherAlert, setSelectedWeatherAlert] = useState<number[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [weatherAlertPerPage] = useState(12);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "role",
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
			weather => weather.role.toLowerCase().includes(query),
		);
	}, [weatherAlert, searchQuery]);

	const sortedWeatherAlert = useMemo(() => {
		const sorted = [...filteredWeatherAlert].sort((a: Role, b: Role) => {
			const key = sortConfig.key;
			let valA = a[key];
			let valB = b[key];
			if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
			if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [filteredWeatherAlert, sortConfig]);

	const displayedWeatherAlert = useMemo(() => {
		return sortedWeatherAlert.slice(startIdx, endIdx);
	}, [sortedWeatherAlert, startIdx, endIdx]);

	const handleSort = (key: keyof Role) => {
		setSortConfig(prevConfig => ({
			key,
			direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
		}));
	};

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
						Role Management
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
									Add New Role
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
						Role Management
					</div>
					{/* <div className="text-xs sm:text-base text-textSecondary dark:text-textDark leading-[21px] sm:leading-[26px]">
						{selectedWeatherAlert.length === 0
							? "0 Weather Alert selected"
							: `${selectedWeatherAlert.length} Weather Alert${selectedWeatherAlert.length > 1 ? "s" : ""} selected`}
					</div> */}
				</div>
				<div className="w-full overflow-x-auto overflow-hidden">
					<div className="flex flex-col items-start gap-[5.54px] sm:gap-[7.54px] relative self-stretch min-w-[650px] sm:min-w-[1450px] w-full flex-[0_0_auto] min-h-[500px] sm:min-h-[700px]">
						<div className="flex h-[42px] sm:h-[52px] items-start sm:justify-between relative self-stretch w-full bg-fgc dark:bg-fgcDark rounded-xl">
							<div
								className="flex w-[152px] sm:w-[220px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSort("role")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Role
								</div>
								<Icon
									icon={
										sortConfig?.key === "role"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div
								className="flex w-[227px] sm:w-[682px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer">
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Description
								</div>
							</div>
							<div className="flex items-center w-[89px] sm:w-[250px] gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative sm:flex-1 self-stretch sm:grow">
								<div className="font-medium relative text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Total Users
								</div>
							</div>
							<div
								className="flex w-[96.5px] sm:w-[180px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
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
							<div className="inline-flex flex-col items-center w-[72px] sm:w-[130px] justify-center gap-2.5 px-3 sm:px-5 py-3.5 relative self-stretch flex-[0_0_auto]">
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Actions
								</div>
							</div>
						</div>

						{/* Render weather Alert rows dynamically */}
						<>
							{displayedWeatherAlert.length === 0 ? (
								<div className="w-full flex items-center justify-center py-11">
									<span className="text-textSecondary dark:text-textDark text-base sm:text-lg">
										No data found
									</span>
								</div>
							) : (
								displayedWeatherAlert.map((weather, idx) => {
									const weatherAlertOnPage = displayedWeatherAlert.length;
									const isLastFour = weatherAlertOnPage >= 7 && idx >= weatherAlertOnPage - 4;
									const menuPositionClass = isLastFour
										? "origin-bottom-right bottom-full mb-2.5 sm:mb-[17px]"
										: "origin-top-right top-full mt-2.5 sm:mt-[17px]";
									return (
										<React.Fragment key={weather.id}>
											<div className="flex h-8 sm:h-11 items-start justify-start relative self-stretch w-full">
												{/* Name */}
												<div className="flex w-[152px] sm:w-[220px] items-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{weather.role}
													</div>
												</div>

												{/* Description */}
												<div className="flex flex-col w-[227px] sm:w-[682px] items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{weather.desc}
													</div>
												</div>

												{/* totalUsers */}
												<div className="flex flex-col w-[89px] sm:w-[250px] items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative sm:flex-1 self-stretch sm:grow">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{weather.totalUsers}
													</div>
												</div>


												{/* Status */}
												<div className="w-[96.5px] sm:w-[180px] flex flex-col items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div
														className={`font-normal ${weather.statusColor} text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap`}>
														{weather.status}
													</div>
												</div>

												{/* Actions */}
												<div className="flex flex-col w-[72px] sm:w-[130px] items-center justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
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
																					const globalIndex = weatherAlert.findIndex(
																						u => u.id === weather.id,
																					);
																					setEditIndex(globalIndex);
																					setIsAddEditWeatherAlertPopupOpen(true);
																				}}>
																				Edit
																			</div>
																		</Menu.Item>
																		<Menu.Item>
																			<div
																				className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																				onClick={() => {
																					setDeleteUserIndex(
																						weatherAlert.findIndex(
																							u => u.id === weather.id,
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
											{idx < displayedWeatherAlert.length - 1 && (
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
						? { name: weatherAlert[deleteUserIndex].role }
						: null
				}
				itemType=" Role"
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
