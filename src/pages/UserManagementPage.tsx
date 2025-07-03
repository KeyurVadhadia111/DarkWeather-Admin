import AddEditUserPopup from "components/popup/AddEditUserPopup";
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
import { apiClient } from "api/client";

interface User {
	id: number;
	avatar: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	plan: string;
	planBg: string;
	planText: string;
	lastLogin: string;
	status: string;
	statusColor: string;
}

interface SortConfig {
	key: keyof User;
	direction: "asc" | "desc";
}

export default function UserManagementPage() {
	// Example user data array with duplicates removed
	const [users, setUsers] = useState<User[]>([
	]);
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [usersPerPage] = useState(10);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "username",
		direction: "asc",
	});
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [isAddEditUserPopupOpen, setIsAddEditUserPopupOpen] = useState(false);
	const isSideExpanded = useAppState(state => state.isSideExpanded);

	const [startIdx, setStartIdx] = useState(0);
	const [endIdx, setEndIdx] = useState(0);

	const [isDeleteUserPopupOpen, setIsDeleteUserPopupOpen] = useState(false);
	const [deleteUserIndex, setDeleteUserIndex] = useState<number | null>(null);

	const userDetails = useAppState(state => state.userDetails);
	const [totalUsersCount, setTotalUsersCount] = useState(0);

	const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
	const [resetUserEmail, setResetUserEmail] = useState<string>("");
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState("");
	const [roles, setRoles] = useState([]);

	// Filter users by search query (name or email)
	const filteredUsers = useMemo(() => {
		if (!searchQuery.trim()) return users;
		const query = searchQuery.toLowerCase();
		return users.filter(
			user => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
		);
	}, [users, searchQuery]);

	const displayedUsers = filteredUsers;

	const handleSort = (key: keyof User) => {
		setSortConfig(prevConfig => ({
			key,
			direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
		}));
		setCurrentPage(1);
		fetchPaginatedUsers();
	};

	/* Start for checkbox */
	const allChecked = displayedUsers.length > 0 && displayedUsers.every((u: User) => selectedUsers.includes(u.id));
	const isIndeterminate =
		displayedUsers.length > 0 && selectedUsers.some(id => displayedUsers.some(u => u.id === id)) && !allChecked;

	const handleSelectAll = () => {
		if (allChecked) {
			const pageIds = displayedUsers.map((u: User) => u.id);
			setSelectedUsers(prev => prev.filter(id => !pageIds.includes(id)));
		} else {
			const pageIds = displayedUsers.map((u: User) => u.id);
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

	const fetchPaginatedUsers = async () => {
		try {
			const response = await apiClient.post(`api/admin/users/all?page=${currentPage}&limit=10&sort_by=${sortConfig.key}&order=${sortConfig.direction}`, {
				headers: {
					Authorization: `Bearer ${userDetails.access_token}`,
					'Content-Type': 'application/json', // optional
				},
			});

			const resJson = await response.json();
			const usersData = resJson.data.data;


			const mappedUsers = usersData.map((user) => ({
				id: user.uuid,
				avatar: user.profile_picture || "/assets/images/user.png",
				name: user.username,
				email: user.email,
				phone: user.mobile_number,
				role: user.role,
				plan: user.plan_name,
				planBg: "bg-primary/10",
				planText: "text-primary",
				lastLogin: user.last_login ? (new Date(user.last_login).toLocaleString("en-US", {
					dateStyle: "long",
					timeStyle: "short",
				})) : "",
				status: user.is_suspended ? "Suspended" : "Active",
				statusColor: user.is_suspended ? "text-textRed" : "text-textGreen",
			}));

			setUsers(mappedUsers);
			setTotalUsersCount(resJson.data.total_count);
			setStartIdx((currentPage - 1) * 10);
			setEndIdx(Math.min(startIdx + 10, totalUsersCount));
		} catch (error) {
			toast.error(error);
		}
	};

	const fetchPaginatedRoles = async () => {
		try {
			const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
			const response = apiClient.post('api/admin/role-permission/all', {
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json', // optional
				},
			});
			const resJson = await response.json();

			const mappedRoles = resJson.data?.roles?.map((x) => ({
				value: x.uuid,
				text: x.name.toLowerCase()
					.split(' ')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' '),
			}));

			setRoles(mappedRoles);
		} catch (error) {
			console.log("Failed to fetch all roles", error);
		}
	};

	useEffect(() => {
		fetchPaginatedUsers();
		fetchPaginatedRoles();
	}, []);

	useEffect(() => {
		if (!isAddEditUserPopupOpen) {
			fetchPaginatedUsers();
			fetchPaginatedRoles();
		}
	}, [isAddEditUserPopupOpen]);

	return (
		<div
			className={`${isSideExpanded ? "w-full sm:w-[calc(100vw-385px)]" : "w-full sm:w-[calc(100vw-163px)]"} flex flex-col items-start gap-5 sm:gap-6 p-2.5 sm:p-6 bg-bgc dark:bg-fgcDark rounded-[10px] sm:rounded-[20px]`}>
			{/* ...header and search/filter UI... */}
			<div className="flex flex-col items-center justify-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
				<div className="flex sm:h-14 items-center w-full">
					<div className="relative font-medium text-text dark:text-textDark text-xl sm:text-2xl tracking-[0] leading-5 sm:leading-6 whitespace-nowrap">
						User Management
					</div>
				</div>
				<div className="flex items-center justify-around gap-3 p-2.5 sm:px-6 sm:py-4 relative self-stretch w-full flex-[0_0_auto] bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-4 relative flex-1 grow w-full">
						<div className="flex items-center gap-3 relative w-full">
							<div className="flex items-center w-full">
								<Icon
									icon="search"
									className="w-5 h-5 sm:w-6 sm:h-6 dark:text-textDark text-text shrink-0  absolute left-2.5 sm:left-3.5  z-10"
								/>
								<Input
									className="font-normal !pl-[35px] sm:!pl-[50px] !h-[42px] sm:!h-[56px] text-bgcSecondary dark:text-textDark text-sm whitespace-nowrap border-[none] !p-0 !outline-0 !ring-0 !self-stretch  !bg-fgc dark:!bg-fgcDark "
									placeholder="Search by name or email"
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
							<Button className="flex !bg-transparent hover:!bg-transparent h-[42px] sm:h-14 justify-center sm:px-8 py-3 sm:py-4 flex-[0_0_auto] rounded-lg sm:rounded-xl border border-solid border-textSecondary/50 items-center gap-8 relative">
								<div className="relative  font-normal text-textSecondary dark:text-textDark text-xs sm:text-base tracking-[0] leading-6 whitespace-nowrap">
									Export Users
								</div>
							</Button>
							<Button
								className="flex h-[42px] sm:h-14 items-center justify-center gap-3 sm:px-6 py-3 sm:py-4 relative flex-[0_0_auto] bg-primary rounded-lg sm:rounded-xl"
								onClick={() => {
									setEditIndex(null);
									setIsAddEditUserPopupOpen(true);
								}}>
								<Icon icon="plus" className="w-5 h-5 sm:w-7 sm:h-7" />
								<div className="relative  font-semibold text-text text-xs sm:text-base tracking-[0] leading-6 whitespace-nowrap">
									Add New User
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
						User List
					</div>
					<div className="text-xs sm:text-base text-textSecondary dark:text-textDark leading-[21px] sm:leading-[26px]">
						{selectedUsers.length === 0
							? "0 users selected"
							: `${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""} selected`}
					</div>
				</div>
				<div className="w-full overflow-x-auto overflow-hidden">
					<div className="flex flex-col items-start gap-[5.54px] sm:gap-[7.54px] relative self-stretch min-w-[1027px] sm:min-w-[1526px] w-full flex-[0_0_auto] min-h-[500px] sm:min-h-[700px]">
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
								className="flex w-[180px] sm:w-[220px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSort("username")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Name
								</div>
								<Icon
									icon={
										sortConfig?.key === "username"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div
								className="flex w-[168px] sm:w-[232px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSort("email")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Email
								</div>
								<Icon
									icon={
										sortConfig?.key === "email"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div className="flex items-center w-[112px] sm:w-auto gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative sm:flex-1 self-stretch sm:grow">
								<div className="font-medium relative text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Phone Number
								</div>
							</div>
							<div
								className="flex w-[120px] sm:w-[152px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
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
								className="flex items-center w-[129px] sm:w-auto gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative sm:flex-1 self-stretch sm:grow cursor-pointer"
								onClick={() => handleSort("plan_name")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Plan
								</div>
								<Icon
									icon={
										sortConfig?.key === "plan_name"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div
								className="flex items-center gap-1 sm:gap-2 w-[136px] sm:w-auto px-3 sm:px-5 py-3.5 relative sm:flex-1 self-stretch sm:grow cursor-pointer"
								onClick={() => handleSort("last_login")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Last Login
								</div>
								<Icon
									icon={
										sortConfig?.key === "last_login"
											? sortConfig.direction === "asc"
												? "up-sort"
												: "up-sort"
											: "sort"
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
								/>
							</div>
							<div
								className="flex w-[85px] sm:w-[124px] items-center gap-1 sm:gap-2 px-3 sm:px-5 py-3.5 relative self-stretch cursor-pointer"
								onClick={() => handleSort("is_suspended")}>
								<div className="relative  font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] sm:leading-6 whitespace-nowrap">
									Status
								</div>
								<Icon
									icon={
										sortConfig?.key === "is_suspended"
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
								displayedUsers.map((user, idx) => {
									const usersOnPage = displayedUsers.length;
									const isLastFour = usersOnPage >= 7 && idx >= usersOnPage - 4;
									const menuPositionClass = isLastFour
										? "origin-bottom-right bottom-full mb-2.5 sm:mb-[17px]"
										: "origin-top-right top-full mt-2.5 sm:mt-[17px]";
									return (
										<React.Fragment key={user.id}>
											<div className="flex h-8 sm:h-11 items-start justify-between relative self-stretch w-full">
												{/* Checkbox */}
												<div className="inline-flex flex-col items-start justify-center gap-2.5 px-[9px] sm:px-4 py-3.5 relative self-stretch flex-[0_0_auto]">
													<label className="relative w-6 h-6 flex items-center justify-center cursor-pointer">
														<input
															type="checkbox"
															checked={selectedUsers.includes(user.id)}
															onChange={() => handleCheckbox(user.id)}
															className="opacity-0 absolute w-5 h-5 sm:w-6 sm:h-6 cursor-pointer bg-transparent"
														/>
														<span
															className={`w-[17px] h-[17px] rounded-[2px] border border-textSecondary flex items-center justify-center transition-colors duration-150 ${selectedUsers.includes(user.id)
																? "bg-primary !border-primary"
																: "bg-transparent"
																}`}>
															{selectedUsers.includes(user.id) && (
																<Icon
																	icon="check"
																	className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-[1px] mt-0.5 sm:ml-0.5	"
																/>
															)}
														</span>
													</label>
												</div>

												{/* Name */}
												<div className="flex w-[180px] sm:w-[220px] items-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="relative w-8 h-8 rounded-2xl">
														<img
															src={user.avatar}
															alt="User Avatar"
															className="w-full h-full rounded-2xl object-cover"
														/>
													</div>
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{user.name}
													</div>
												</div>

												{/* Email */}
												<div className="flex flex-col w-[168px] sm:w-[232px] items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-3 truncate whitespace-nowrap overflow-hidden w-full">
														{user.email}
													</div>
												</div>

												{/* Phone */}
												<div className={`flex flex-col w-[112px] sm:w-auto ${user.phone ? "items-start" : 'items-center'} justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative sm:flex-1 self-stretch sm:grow`}>
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{user.phone ? user.phone : '-'}
													</div>
												</div>

												{/* Role */}
												<div className="font-normal text-text dark:text-textDark text-xs sm:text-base tracking-[0] leading-6 w-[101px] sm:w-[152px] break-words whitespace-pre-wrap">
													{Array.isArray(user.role) ? user.role.map((x) => x.name.toLowerCase()
														.split(' ')
														.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
														.join(' ')
													).join(', ') : user.role}
												</div>

												{/* Plan */}
												<div className="flex flex-col w-[129px] sm:w-auto items-start justify-center gap-2.5  sm:px-5 sm:py-4 relative sm:flex-1 self-stretch sm:grow">
													<div
														className={`flex w-auto sm:w-[136px] h-8 sm:h-[34px] items-center gap-8 px-3 py-1	sm:px-4 sm:py-2`}>
														<div
															className={`relative mt-[-2.50px] mb-[-0.50px] font-normal text-xs sm:text-sm ${user.planText} text-sm tracking-[0] sm:leading-[21px] whitespace-nowrap`}>
															{user.plan}
														</div>
													</div>
												</div>

												{/* Last Login */}
												<div className="flex flex-col items-start justify-center w-[136px] sm:w-auto gap-2.5 px-3 sm:px-5 sm:py-4 relative sm:flex-1 self-stretch sm:grow">
													<div className="font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
														{user.lastLogin}
													</div>
												</div>

												{/* Status */}
												<div className="w-[85px] sm:w-[124px] flex flex-col items-start justify-center gap-2.5 px-3 sm:px-5 sm:py-4 relative self-stretch">
													<div
														className={`font-normal ${user.statusColor} text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap`}>
														{user.status}
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
																					const globalIndex = users.findIndex(
																						u => u.id === user.id,
																					);
																					setEditIndex(globalIndex);
																					setIsAddEditUserPopupOpen(true);
																				}}>
																				Edit
																			</div>
																		</Menu.Item>
																		<Menu.Item>
																			<div
																				className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																				onClick={() => {
																					setDeleteUserIndex(
																						users.findIndex(
																							u => u.id === user.id,
																						),
																					);
																					setIsDeleteUserPopupOpen(true);
																				}}>
																				Delete
																			</div>
																		</Menu.Item>
																		<Menu.Item>
																			<div
																				className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																				onClick={() => {
																					setResetUserEmail(user.email);
																					setIsResetPasswordOpen(true);
																				}}>
																				Reset Password
																			</div>
																		</Menu.Item>
																		<Menu.Item>
																			<div
																				className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																				onClick={() => {
																					navigate("/activity-log", {
																						state: {
																							name: user.name,
																							email: user.email,
																						},
																					});
																					setTimeout(() => {
																						window.scrollTo({
																							top: 0,
																							behavior: "smooth",
																						});
																					}, 100);
																				}}>
																				Activity log
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
							{totalUsersCount === 0
								? "Showing 0 of 0 users"
								: `Showing ${startIdx + 1} of ${endIdx} users`}
						</span>
					</div>
					{totalUsersCount !== 0 && (
						<Pagination
							totalRecords={filteredUsers.length}
							recordsPerPage={usersPerPage}
							currentPage={currentPage}
							handlePageChange={(page: number) => {
								setCurrentPage(page);
								fetchPaginatedUsers();
							}}
						/>
					)}
				</div>
			</div>
			<AddEditUserPopup
				isOpen={isAddEditUserPopupOpen}
				setIsOpen={() => {
					setEditIndex(null);
					setIsAddEditUserPopupOpen(false);
				}}
				list={users}
				setList={setUsers}
				roles={roles}
				editIndex={editIndex}
			/>
			<DeleteUserPopup
				isOpen={isDeleteUserPopupOpen}
				setIsOpen={setIsDeleteUserPopupOpen}
				user={deleteUserIndex !== null ? users[deleteUserIndex] : null}
				itemType="User"
				onDelete={() => {
					if (deleteUserIndex !== null) {
						setUsers(prev => prev.filter((_, idx) => idx !== deleteUserIndex));
						setDeleteUserIndex(null);
						setIsDeleteUserPopupOpen(false);
						toast.success("User deleted successfully");
					}
				}}
			/>
			<ResertPasswordPopup
				isOpen={isResetPasswordOpen}
				setIsOpen={setIsResetPasswordOpen}
				email={resetUserEmail}
			/>
		</div>
	);
}
