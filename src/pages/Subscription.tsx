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
import AddEditRoleManagement from "components/popup/AddEditRoleManagement";
import AddEditSubscription from "components/popup/AddEditSubscription";

interface Role {
	id: number;
	planName: string;
	price: string;
	users: string;
	discount: string;
	status: string;
	statusColor: string;
}

interface billingInvoices {
	id: number;
	invoiceID: string;
	userName: string;
	plan: string;
	price: string;
	date: string;
	Invoice: string;
	status: string;
	statusColor: string;
}

interface SortConfig {
	key: keyof Role;
	direction: "asc" | "desc";
}

interface SortConfigBilling {
	key: keyof billingInvoices;
	direction: "asc" | "desc";
}

export default function Subscription() {
	// Example Weather Alert data array with duplicates removed

	const subscriptionData = [
		{
			id: 1,
			name: "Active Users",
			icon: "active-users",
			changeIcon: "arrow-up-small",
			totalNumber: 8456,
			groth: "+8%",
			color: "#22BD22",
		},
		{
			id: 2,
			name: "Active Subscriptions",
			icon: "crown",
			changeIcon: "arrow-up-small",
			totalNumber: 3122,
			groth: "+12%",
			color: "#22BD22",
		},
		{
			id: 3,
			name: "Cancelled Subscriptions",
			icon: "cancel",
			changeIcon: "arrow-down-small",
			totalNumber: 624,
			groth: "+7%",
			color: "#E95478",
		},
		{
			id: 4,
			name: "Monthly Recurring Rev.",
			icon: "garph",
			changeIcon: "arrow-up-small",
			totalNumber: 275300,
			groth: "+16%",
			color: "#22BD22",
		},
	]

	const [weatherAlert, setWeatherAlert] = useState<Role[]>([
		{
			id: 1,
			planName: "Free Tier",
			price: "$0",
			users: "7,480",
			discount: "00%",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 2,
			planName: "Premium Tier",
			price: "$9.99",
			users: "2,912",
			discount: "12%",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 3,
			planName: "Consultation Tier",
			price: "Custom Quote",
			users: "120",
			discount: "16%",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 4,
			planName: "Legacy Plan",
			price: "$6.99",
			users: "00",
			discount: "10%",
			status: "Inactive",
			statusColor: "text-textRed",
		}
	]);

	const [billingInvoices, setBillingInvoices] = useState<billingInvoices[]>([
		{
			id: 1,
			invoiceID: "#INV-5234",
			userName: "Neha K.",
			plan: "Premium",
			price: "$9.99",
			date: "Jun 18, 2025",
			Invoice: "",
			status: "Paid",
			statusColor: "text-textGreen",
		},
		{
			id: 2,
			invoiceID: "#INV-5221",
			userName: "Arjun S. ",
			plan: "Free",
			price: "$0",
			date: "Jun 16, 2025",
			Invoice: "",
			status: "Paid",
			statusColor: "text-textGreen",
		},
		{
			id: 3,
			invoiceID: "#INV-5199",
			userName: "Sneha R.",
			plan: "Consultation",
			price: "Custom Quote",
			date: "Jun 12, 2025",
			Invoice: "",
			status: "Failed",
			statusColor: "text-textRed",
		},
		{
			id: 4,
			invoiceID: " #INV-5260",
			userName: "Vikram T.",
			plan: "Premium",
			price: "$9.99",
			date: "Jun 10, 2025",
			Invoice: "",
			status: "Paid",
			statusColor: "text-textGreen",
		},
		{
			id: 5,
			invoiceID: "#INV-5248",
			userName: "Priya M.",
			plan: "Premium",
			price: "$9.99",
			date: "Jun 08, 2025",
			Invoice: "",
			status: "Failed",
			statusColor: "text-textRed",
		}
	]);

	const [selectedWeatherAlert, setSelectedWeatherAlert] = useState<number[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [weatherAlertPerPage] = useState(12);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "planName",
		direction: "asc",
	});
	const [SortConfigBiling, setSortConfigBiling] = useState<SortConfigBilling>({
		key: "userName",
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
			weather => weather.planName.toLowerCase().includes(query),
		);
	}, [weatherAlert, searchQuery]);

	// Filter weatherAlert by search query (name or email)
	const filteredBillingInvoices = useMemo(() => {
		if (!searchQuery.trim()) return billingInvoices;
		const query = searchQuery.toLowerCase();
		return billingInvoices.filter(
			weather => weather.userName.toLowerCase().includes(query),
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

	const sortedBillingInvoices = useMemo(() => {
		const sorted = [...filteredBillingInvoices].sort((a: billingInvoices, b: billingInvoices) => {
			const key = SortConfigBiling.key;
			let valA = a[key];
			let valB = b[key];
			if (valA < valB) return SortConfigBiling.direction === "asc" ? -1 : 1;
			if (valA > valB) return SortConfigBiling.direction === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [filteredBillingInvoices, SortConfigBiling]);

	const displayedWeatherAlert = useMemo(() => {
		return sortedWeatherAlert.slice(startIdx, endIdx);
	}, [sortedWeatherAlert, startIdx, endIdx]);

	const displayedBillingInvoices = useMemo(() => {
		return sortedBillingInvoices.slice(startIdx, endIdx);
	}, [sortedBillingInvoices, startIdx, endIdx]);
	console.log("displayedBillingInvoices", displayedBillingInvoices)
	const handleSort = (key: keyof Role) => {
		setSortConfig(prevConfig => ({
			key,
			direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
		}));
	};
	const handleSortBilling = (key: keyof billingInvoices) => {
		setSortConfigBiling(prevConfig => ({
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
				<div className="flex flex-col gap-5 w-full">
					<div className="flex flex-col md:flex-row md:gap-0 gap-5 md:h-14 justify-between items-start md:items-center w-full">
						<div className="relative font-medium text-text dark:text-textDark text-xl sm:text-2xl tracking-[0] leading-5 sm:leading-6">
							Subscription & Premium Management
						</div>
						<Button
							className="flex h-[42px] sm:h-14 items-center justify-center gap-3 sm:px-6 py-3 sm:py-4 relative flex-[0_0_auto] bg-primary rounded-lg sm:rounded-xl"
							onClick={() => {
								setEditIndex(null);
								setIsAddEditWeatherAlertPopupOpen(true);
							}}>
							<Icon icon="plus" className="w-5 h-5 sm:w-7 sm:h-7" />
							<div className="relative  font-semibold text-text text-xs sm:text-base tracking-[0] leading-6 whitespace-nowrap">
								Add New Plan
							</div>
						</Button>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
						{subscriptionData.map(item => (
							<div
								key={item.id}
								className="flex flex-col justify-between gap-8 w-full bg-[#F8F8F8] dark:bg-[#202020] p-5 rounded-2xl"
							>
								<div className="flex justify-between w-full">
									<div className="flex justify-center items-center w-[42px] h-[42px] bg-text dark:bg-bgc rounded-lg">
										<Icon icon={item.icon} className="w-[18px] h-[18px] text-white dark:text-black" />
									</div>
									<span className="font-medium text-2xl text-text dark:text-textDark">{item.totalNumber}</span>
								</div>

								<div className="flex justify-between w-full">
									<span className="text-textSecondary dark:text-textDark text-lg">{item.name}</span>
									<div className="flex items-center gap-0.5 flex-[0_0_auto]">
										<div className="font-normal dark:text-textDark text-textSecondary text-xs sm:text-base sm:leading-6 w-fit tracking-[0] whitespace-nowrap">
											{item.groth}
										</div>
										<Icon
											icon={item.changeIcon}
											className={`w-3 h-3 sm:w-[18px] sm:h-[18px]`}
											style={{ color: item.color }}
										/>
									</div>
								</div>
							</div>
						))}
					</div>

				</div>
			</div>

			<div className="flex flex-col w-full items-start gap-4 p-4 relative bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				{/* ...table header... */}
				<div className="flex items-center justify-between w-full">
					<div className="text-base sm:text-xl font-medium text-text dark:text-textDark leading-[21px] sm:leading-[26px]">
						Plans
					</div>
					{/* <div className="text-xs sm:text-base text-textSecondary dark:text-textDark leading-[21px] sm:leading-[26px]">
						{selectedWeatherAlert.length === 0
							? "0 Weather Alert selected"
							: `${selectedWeatherAlert.length} Weather Alert${selectedWeatherAlert.length > 1 ? "s" : ""} selected`}
					</div> */}
				</div>
				<div className="w-full overflow-x-auto overflow-hidden">
					<div className="flex flex-col items-start gap-[5.54px] sm:gap-[7.54px] relative self-stretch min-w-[562px] sm:min-w-[950px] w-full flex-[0_0_auto] h-full">
						<div className="flex h-[42px] sm:h-[52px] items-start sm:justify-between relative self-stretch w-full bg-fgc dark:bg-fgcDark rounded-xl">
							<div
								className="flex w-[120px] sm:w-[200px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSort("planName")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Plan Name
								</div>
								<Icon
									icon={
										sortConfig?.key === "planName"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div
								className="flex w-[112px] sm:w-[200px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer">
								<div className="relative font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Price (Monthly)
								</div>
							</div>
							<div className="flex items-center w-[68px] sm:w-[180px] gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative sm:flex-1 self-stretch sm:grow">
								<div className="font-medium relative text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Users
								</div>
							</div>
							<div className="flex items-center w-[76px] sm:w-[180px] gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative sm:flex-1 self-stretch sm:grow">
								<div className="font-medium relative text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Discount
								</div>
							</div>
							<div
								className="flex w-[97px] sm:w-[132px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
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
							<div className="inline-flex flex-col items-center w-[72px] sm:w-[108px] justify-center gap-2.5 px-3 sm:px-5 py-3.5 relative self-stretch flex-[0_0_auto]">
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
												<div className="flex w-[120px] sm:w-[200px] items-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{weather.planName}
													</div>
												</div>

												{/* Description */}
												<div className="flex flex-col w-[112px] sm:w-[200px] items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{weather.price}
													</div>
												</div>

												{/* totalUsers */}
												<div className="flex flex-col w-[68px] sm:w-[180px] items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative sm:flex-1 self-stretch sm:grow">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{weather.users}
													</div>
												</div>

												{/* discount */}
												<div className="flex flex-col w-[76px] sm:w-[180px] items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative sm:flex-1 self-stretch sm:grow">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{weather.discount}
													</div>
												</div>


												{/* Status */}
												<div className="w-[97px] sm:w-[130px] flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
													{/* Status text */}
													<div
														className={`font-normal ${weather.statusColor} text-[10px] sm:text-base text-center tracking-[0] leading-[1.2] whitespace-nowrap`}
													>
														{weather.status}
													</div>

													{/* Switch */}
													<div
														className="w-[26px] h-[16px] rounded-full flex items-center px-0.5 transition-all duration-300 bg-[#808080]"
													>
														<div
															className={`w-[14px] h-[14px] rounded-full transition-all duration-300 transform ${weather.status === "Active"
																? "translate-x-[9px] bg-[#FFA500]"
																: "translate-x-[-1px] bg-[#F8F8F8]"
																}`}
														/>
													</div>
												</div>

												{/* Actions */}
												<div className="flex flex-col w-[72px] sm:w-[108px] items-center justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
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


			<div className="flex flex-col w-full items-start gap-4 p-4 relative bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				{/* ...table header... */}
				<div className="flex items-center justify-between w-full">
					<div className="text-base sm:text-xl font-medium text-text dark:text-textDark leading-[21px] sm:leading-[26px]">
						Billing & Invoices
					</div>
					{/* <div className="text-xs sm:text-base text-textSecondary dark:text-textDark leading-[21px] sm:leading-[26px]">
						{selectedWeatherAlert.length === 0
							? "0 Weather Alert selected"
							: `${selectedWeatherAlert.length} Weather Alert${selectedWeatherAlert.length > 1 ? "s" : ""} selected`}
					</div> */}
				</div>
				<div className="w-full overflow-x-auto overflow-hidden">
					<div className="flex flex-col items-start gap-[5.54px] sm:gap-[7.54px] relative self-stretch min-w-[750px] sm:min-w-[1450px] w-full flex-[0_0_auto] h-full">
						<div className="flex h-[42px] sm:h-[52px] items-start sm:justify-between relative self-stretch w-full bg-fgc dark:bg-fgcDark rounded-xl">
							<div
								className="flex w-[120px] sm:w-[226.33px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSortBilling("invoiceID")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Invoice ID
								</div>
								<Icon
									icon={
										sortConfig?.key === "planName"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div
								className="flex w-[120px] sm:w-[226.33px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer">
								<div className="relative font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									User Name
								</div>
							</div>
							<div className="flex items-center w-[100px] sm:w-[226.33px] gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch">
								<div className="font-medium relative text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Plan
								</div>
							</div>
							<div className="flex items-center w-[120px] sm:w-[226.33px] gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch">
								<div className="font-medium relative text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Price (Monthly)
								</div>
							</div>
							<div className="flex items-center w-[120px] sm:w-[226.33px] gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch">
								<div className="font-medium relative text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Date
								</div>
							</div>
							<div
								className="flex w-[97px] sm:w-[226.33px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSortBilling("status")}>
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
							<div className="inline-flex flex-col items-center w-[72px] sm:w-[104px] justify-center gap-2.5 px-3 sm:px-5 py-3.5 relative self-stretch flex-[0_0_auto]">
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Invoice
								</div>
							</div>
						</div>

						{/* Render weather Alert rows dynamically */}
						<>
							{displayedBillingInvoices.length === 0 ? (
								<div className="w-full flex items-center justify-center py-11">
									<span className="text-textSecondary dark:text-textDark text-base sm:text-lg">
										No data found
									</span>
								</div>
							) : (
								displayedBillingInvoices.map((item, idx) => {
									const billingInvoicesOnPage = displayedBillingInvoices.length;
									const isLastFour = billingInvoicesOnPage >= 7 && idx >= billingInvoicesOnPage - 4;
									const menuPositionClass = isLastFour
										? "origin-bottom-right bottom-full mb-2.5 sm:mb-[17px]"
										: "origin-top-right top-full mt-2.5 sm:mt-[17px]";
									return (
										<React.Fragment key={item.id}>
											<div className="flex h-8 sm:h-11 items-start justify-start relative self-stretch w-full">
												{/* invoice ID */}
												<div className="flex w-[120px] sm:w-[226.33px] items-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{item.invoiceID}
													</div>
												</div>

												{/* User Name */}
												<div className="flex flex-col w-[120px] sm:w-[226.33px] items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{item.userName}
													</div>
												</div>

												{/* Paln */}
												<div className="flex flex-col w-[100px] sm:w-[226.33px] items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{item.plan}
													</div>
												</div>

												{/* Price */}
												<div className="flex flex-col w-[120px] sm:w-[226.33px] items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{item.price}
													</div>
												</div>

												{/* Date */}
												<div className="flex flex-col w-[120px] sm:w-[226.33px] items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{item.date}
													</div>
												</div>


												{/* Status */}
												<div className="w-[97px] sm:w-[226.33px] flex flex-col items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													{/* Status text */}
													<div
														className={`font-normal ${item.statusColor} text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap`}>
														{item.status}
													</div>
												</div>

												{/* Actions */}
												<div className="flex flex-col w-[72px] sm:w-[104px] items-center justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="inline-flex items-center justify-center gap-2 px-[7px] sm:p-2.5 bg-fgc dark:bg-fgcDark rounded-[4px] sm:rounded-lg cursor-pointer">
														<Icon
															icon="download-1"
															className="w-[11px] h-[11px] sm:w-4 sm:h-4 text-textSecondary dark:text-textDark"
														/>
													</div>
												</div>
											</div>

											{/* Divider */}
											{idx < displayedBillingInvoices.length - 1 && (
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


			<AddEditSubscription
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
						? { name: weatherAlert[deleteUserIndex].planName }
						: null
				}
				itemType="Plan"
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
