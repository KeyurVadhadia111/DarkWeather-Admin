import useAppState from "components/utils/useAppState";
import React, { useEffect, useMemo, useState } from "react";
import DeleteUserPopup from "components/popup/DeleteUserPopup";
import { toast } from "components/utils/toast";
import BroadcastMessage from "components/Notification/BroadcastMessage";
import ManageTemplates from "components/Notification/ManageTemplates";
import AddEditManageTemplatePopup from "components/popup/AddEditManageTemplatePopup";
import ScheduledNotification from "components/Notification/ScheduledNotification";
import AddEditScheduledNotificationPopup from "components/popup/AddEditScheduledNotificationPopup";

interface ManageTemplateType {

	id: number;
	templateName: string;
	channel: string;
	triggerEvent: string;
	fileName: string;
	recipients: string[];
	status: string;
	statusColor: string;
}

interface scheduledNotificationType {
	id: number;
	scheduleID: string;
	messageTitle: string;
	channel: string;
	scheduledTime: string;
	status: string;
	statusColor: string;
}

interface SortConfigManageTemplate {
	key: keyof ManageTemplateType;
	direction: "asc" | "desc";
}

interface SortConfigScheduled {
	key: keyof scheduledNotificationType;
	direction: "asc" | "desc";
}

export default function NotificationSystemPage() {

	const notificationBar = [
		{
			id: 1,
			title: "Broadcast Message",
			name: "broadcastMessage"
		},
		{
			id: 2,
			title: "Manage Push/Email/SMS Templates",
			name: "manageTemplates"
		},
		{
			id: 3,
			title: "Scheduled Notification",
			name: "scheduledNotification"
		}
	]

	const [scheduledNotification, setScheduledNotification] = useState<scheduledNotificationType[]>([
		{
			id: 1,
			scheduleID: "#SCHD-123",
			messageTitle: "New Feature Rollout",
			channel: "Email",
			scheduledTime: "Jun 20, 2025, 10:00 AM",
			status: "Scheduled",
			statusColor: "text-warning",
		},
		{
			id: 2,
			scheduleID: "#SCHD-124",
			messageTitle: "Downtime Alert",
			channel: "Push + SMS",
			scheduledTime: "Jun 21, 2025, 8:00 PM",
			status: "Scheduled",
			statusColor: "text-warning",
		},
		{
			id: 3,
			scheduleID: "#SCHD-125",
			messageTitle: "Weather Alert: NY",
			channel: "Push",
			scheduledTime: "Jun 18, 2025, 6:00 AM",
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 4,
			scheduleID: "#SCHD-126",
			messageTitle: "Weekly Digest Summary",
			channel: "Email",
			scheduledTime: "Jun 22, 2025, 7:00 AM",
			status: "Scheduled",
			statusColor: "text-warning",
		},
		{
			id: 5,
			scheduleID: "#SCHD-127",
			messageTitle: "Security Patch Update",
			channel: "Push",
			scheduledTime: "Jun 23, 2025, 9:30 AM",
			status: "Active",
			statusColor: "text-textGreen",
		},

	]);

	const [manageTemplates, setManageTemplateType] = useState<ManageTemplateType[]>([
		{
			id: 1,
			templateName: "OTP Login Code",
			channel: "SMS",
			triggerEvent: "Login attempt",
			fileName: "otp-login-code.txt",
			recipients: ["Admins"],
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 2,
			templateName: "Subscription Confirmed",
			channel: "Email",
			triggerEvent: "Payment success",
			fileName: "subscription.txt",
			recipients: ["Users"],
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 3,
			templateName: "Alert Notification",
			channel: "Push",
			triggerEvent: "New weather alert",
			fileName: "alert-notification.txt",
			recipients: ["Users"],
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 4,
			templateName: "Password Reset",
			channel: "Email",
			triggerEvent: "Forgot password flow",
			fileName: "password-reset.txt",
			recipients: ["Admins"],
			status: "Active",
			statusColor: "text-textGreen",
		},
		{
			id: 5,
			templateName: "System Maintenance",
			channel: "Push",
			triggerEvent: "Scheduled downtime",
			fileName: "system-maintenance.txt",
			recipients: ["Users"],
			status: "Active",
			statusColor: "text-textGreen",
		},
	]);

	const [activeTab, setActiveTab] = useState(notificationBar[0].name);
	const [currentPage, setCurrentPage] = useState(1);
	const [PostArticlePerPage] = useState(12);

	const [sortConfigManageTemplate, setSortConfigManageTemplate] = useState<SortConfigManageTemplate>({
		key: "templateName",
		direction: "asc",
	});
	const [SortConfigScheduled, setSortConfigScheduled] = useState<SortConfigScheduled>({
		key: "messageTitle",
		direction: "asc",
	});
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [isAddEditManageTemplatePopup, setIsAddEditManageTemplatePopup] = useState(false);
	const [isAddEditScheduledPopup, setIsAddEditScheduledPopup] = useState(false);
	const isSideExpanded = useAppState(state => state.isSideExpanded);

	const startIdx = (currentPage - 1) * PostArticlePerPage;
	const endIdx = Math.min(
		startIdx + PostArticlePerPage,
		activeTab === "manageTemplates"
			? manageTemplates.length
			: scheduledNotification.length
	);

	const [isDeleteUserPopupOpen, setIsDeleteUserPopupOpen] = useState(false);
	const [deleteUserIndex, setDeleteUserIndex] = useState<number | null>(null);

	const [searchQuery, setSearchQuery] = useState("");


	// Filter Manage Temaplate by search query (name or email)
	const filteredManageTemaplate = useMemo(() => {
		if (!searchQuery.trim()) return manageTemplates;
		const query = searchQuery.toLowerCase();
		return manageTemplates.filter(
			item => item.templateName.toLowerCase().includes(query) || item.templateName.toLowerCase().includes(query) ||
				item.channel.toLowerCase().includes(query) || item.channel.toLowerCase().includes(query) ||
				item.triggerEvent.toLowerCase().includes(query) || item.triggerEvent.toLowerCase().includes(query) ||
				item.fileName.toLowerCase().includes(query) || item.fileName.toLowerCase().includes(query) ||
				item.recipients.join(", ").toLowerCase().includes(query) || item.recipients.join(", ").toLowerCase().includes(query)
				||
				item.status.toLowerCase().includes(query) || item.status.toLowerCase().includes(query)
		);
	}, [manageTemplates, searchQuery]);

	const filteredScheduled = useMemo(() => {
		if (!searchQuery.trim()) return scheduledNotification;
		const query = searchQuery.toLowerCase();
		return scheduledNotification.filter(
			item => item.messageTitle.toLowerCase().includes(query) || item.messageTitle.toLowerCase().includes(query) ||
				item.channel.toLowerCase().includes(query) || item.channel.toLowerCase().includes(query) ||
				item.scheduledTime.toLowerCase().includes(query) || item.scheduledTime.toLowerCase().includes(query) ||
				item.scheduleID.toLowerCase().includes(query) || item.scheduleID.toLowerCase().includes(query) ||
				item.status.toLowerCase().includes(query) || item.status.toLowerCase().includes(query)
		);
	}, [scheduledNotification, searchQuery]);

	const sortedManageTemplate = useMemo(() => {
		const sorted = [...filteredManageTemaplate].sort((a: ManageTemplateType, b: ManageTemplateType) => {
			const key = sortConfigManageTemplate.key;
			let valA = a[key];
			let valB = b[key];

			if (typeof valA === "string" && typeof valB === "string") {
				valA = valA.toLowerCase();
				valB = valB.toLowerCase();
			}

			if (valA < valB) return sortConfigManageTemplate.direction === "asc" ? -1 : 1;
			if (valA > valB) return sortConfigManageTemplate.direction === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [filteredManageTemaplate, sortConfigManageTemplate]);

	const sortedScheduled = useMemo(() => {
		const sorted = [...filteredScheduled].sort((a: scheduledNotificationType, b: scheduledNotificationType) => {
			const key = SortConfigScheduled.key;
			let valA = a[key];
			let valB = b[key];

			if (typeof valA === "string" && typeof valB === "string") {
				valA = valA.toLowerCase();
				valB = valB.toLowerCase();
			}

			if (valA < valB) return SortConfigScheduled.direction === "asc" ? -1 : 1;
			if (valA > valB) return SortConfigScheduled.direction === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [filteredScheduled, SortConfigScheduled]);

	const displayedManageTemplate = useMemo(() => {
		return sortedManageTemplate.slice(startIdx, endIdx);
	}, [sortedManageTemplate, startIdx, endIdx]);

	const displayedScheduled = useMemo(() => {
		return sortedScheduled.slice(startIdx, endIdx);
	}, [sortedScheduled, startIdx, endIdx]);


	const handleSortManageTemplate = (key: keyof ManageTemplateType) => {
		setSortConfigManageTemplate(prevConfig => ({
			key,
			direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
		}));
	};

	const handleSortScheduled = (key: keyof scheduledNotificationType) => {
		setSortConfigScheduled(prevConfig => ({
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
						Notification System
					</div>
				</div>
				<div className="w-full overflow-x-auto">
					<div className="flex items-center justify-start gap-3 relative self-stretch w-fit flex-[0_0_auto] bg-bgc dark:bg-bgcDark rounded-xl shadow-[0px_10px_65px_#0000000d] whitespace-nowrap px-2">
						{notificationBar.map((item) => (
							<div
								key={item.id}
								onClick={() => setActiveTab(item.name)}
								className={`py-2.5 px-5 rounded-lg cursor-pointer transition-all duration-200 ${activeTab === item.name
									? "bg-primary font-semibold text-text"
									: "text-gray-700 dark:text-white"
									}`}
							>
								<span className="sm:text-base">{item.title}</span>
							</div>
						))}
					</div>
				</div>

			</div>

			<div className="mt-6 w-full">
				{activeTab === "broadcastMessage" && <BroadcastMessage />}
				{activeTab === "manageTemplates" && <ManageTemplates
					item={displayedManageTemplate}
					manageTemplates={manageTemplates}
					handleSort={handleSortManageTemplate}
					sortConfig={sortConfigManageTemplate}
					filteredManageTemaplate={filteredManageTemaplate}
					startIdx={startIdx}
					endIdx={endIdx}
					PostArticlePerPage={PostArticlePerPage}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					setDeleteUserIndex={setDeleteUserIndex}
					setIsDeleteUserPopupOpen={setIsDeleteUserPopupOpen}
					setEditIndex={setEditIndex}
					setIsAddEditManageTemplatePopup={setIsAddEditManageTemplatePopup}
					setIsAddEditManageTemplatePopupOpen={setIsAddEditManageTemplatePopup}
					searchText={searchQuery}
					setSearchText={setSearchQuery}
				/>}
				{activeTab === "scheduledNotification" &&
					<ScheduledNotification
						item={displayedScheduled}
						scheduledNotification={scheduledNotification}
						handleSort={handleSortScheduled}
						sortConfig={SortConfigScheduled}
						filteredScheduled={filteredScheduled}
						startIdx={startIdx}
						endIdx={endIdx}
						PostArticlePerPage={PostArticlePerPage}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						setDeleteUserIndex={setDeleteUserIndex}
						setIsDeleteUserPopupOpen={setIsDeleteUserPopupOpen}
						setEditIndex={setEditIndex}
						setIsAddEditScheduledPopup={setIsAddEditScheduledPopup}
						setIsAddEditScheduledPopupOpen={setIsAddEditScheduledPopup}
						searchText={searchQuery}
						setSearchText={setSearchQuery}
					/>
				}
			</div>



			<AddEditManageTemplatePopup
				isOpen={isAddEditManageTemplatePopup}
				setIsOpen={() => {
					setEditIndex(null);
					setIsAddEditManageTemplatePopup(false);
				}}
				list={manageTemplates}
				setList={setManageTemplateType}
				editIndex={editIndex}
			/>

			<AddEditScheduledNotificationPopup
				isOpen={isAddEditScheduledPopup}
				setIsOpen={() => {
					setEditIndex(null);
					setIsAddEditScheduledPopup(false);
				}}
				list={scheduledNotification}
				setList={setScheduledNotification}
				editIndex={editIndex}
			/>


			<DeleteUserPopup
				isOpen={isDeleteUserPopupOpen}
				setIsOpen={setIsDeleteUserPopupOpen}
				user={
					deleteUserIndex !== null
						? activeTab === "manageTemplates"
							? { name: manageTemplates[deleteUserIndex]?.templateName }
							: { name: scheduledNotification[deleteUserIndex]?.messageTitle }
						: null
				}
				itemType={
					activeTab === "manageTemplates"
						? "template"
						: "Scheduled Notification"
				}
				onDelete={() => {
					if (deleteUserIndex !== null) {
						if (activeTab === "manageTemplates") {
							setManageTemplateType(prev => prev.filter((_, idx) => idx !== deleteUserIndex));
						} else {
							setScheduledNotification(prev => prev.filter((_, idx) => idx !== deleteUserIndex));
						}

						setDeleteUserIndex(null);
						setIsDeleteUserPopupOpen(false);
						toast.success("Item deleted successfully");
					}
				}}
			/>
		</div>
	);
}
