import Icon from "components/utils/Icon";
import useAppState from "components/utils/useAppState";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
	// Use individual selectors from Zustand store
	const isDark = useAppState(state => state.isDark);
	const userDetails = useAppState(state => state.userDetails);
	const setUserDetails = useAppState(state => state.setUserDetails);
	const isSideExpanded = useAppState(state => state.isSideExpanded);
	const setIsSideExpanded = useAppState(state => state.setIsSideExpanded);

	const sidebarRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	const allMenuItems = [
		{
			title: "Dashboard",
			icon: "dashboard",
			href: "/dashboard",
			roles: ["SuperAdmin", "Analytics", "Support"],
			active: ["/dashboard"],
		},
		{ title: "Login Activity", icon: "login-activity", href: "", roles: ["Support"], active: [""] },
		{
			title: "User Management",
			icon: "user-management",
			href: "/user-management",
			roles: ["SuperAdmin", "Support"],
			active: ["/user-management", "/activity-log"],
		},
		{
			title: "Override Weather Info",
			icon: "override-weather-info",
			href: "override-weather-info",
			roles: ["SuperAdmin"],
			active: ["/override-weather-info"],
		},
		{
			title: "Weather Alert",
			icon: "weather-alert",
			href: "weather-alert",
			roles: ["SuperAdmin"],
			active: ["/weather-alert"],
		},
		{ title: "Role Management", icon: "role-management", href: "", roles: ["SuperAdmin", "Support"], active: [""] },
		{ title: "API Integration", icon: "api-integration", href: "", roles: ["SuperAdmin"], active: [""] },
		{ title: "Subscription", icon: "subscription", href: "", roles: ["SuperAdmin"], active: [""] },
		{
			title: "Alerts & Content Post",
			icon: "alerts-content-post",
			href: "",
			roles: ["SuperAdmin", "Analytics", "Support"],
			active: [""],
		},
		{
			title: "Social Media Configuration",
			icon: "social-media-configuration",
			href: "",
			roles: ["SuperAdmin", "Analytics"],
			active: [""],
		},
		{
			title: "Settings & Configurations",
			icon: "settings-configurations",
			href: "",
			roles: ["SuperAdmin"],
			active: [""],
		},
		{
			title: "Analytics & Reports",
			icon: "analytics-reports",
			href: "",
			roles: ["SuperAdmin", "Analytics"],
			active: [""],
		},
		{
			title: "Feedback Manager",
			icon: "feedback-manager",
			href: "",
			roles: ["SuperAdmin", "Analytics", "Support"],
			active: [""],
		},
		{
			title: "Notification System",
			icon: "notification-system",
			href: "",
			roles: ["SuperAdmin", "Support"],
			active: [""],
		},
		{ title: "Audit Trail System", icon: "audit-trail-system", href: "", roles: ["SuperAdmin"], active: [""] },
		{ title: "Data Export & Import", icon: "data-export-import", href: "", roles: ["SuperAdmin"], active: [""] },
		{
			title: "Scheduled Maintenance",
			icon: "scheduled-maintenance",
			href: "",
			roles: ["SuperAdmin"],
			active: [""],
		},
	];

	const [menuItems, setMenuItems] = useState(allMenuItems);

	useEffect(() => {
		const role = userDetails?.role || "SuperAdmin";
		const filtered = allMenuItems.filter(item => item.roles.includes(role));
		setMenuItems(filtered);
	}, [userDetails]);

	const handleClickOutside = (event: MouseEvent) => {
		if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
			setIsSideExpanded(false);
		}
	};

	useEffect(() => {
		if (isSideExpanded) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isSideExpanded]);

	return (
		<>
			<div
				className={`${isSideExpanded ? "min-w-[330px]" : "w-[108px]"} transition-all duration-300 h-dhv hidden sm:flex flex-col items-start justify-between p-6 bg-text dark:bg-bgc gap-4 rounded-[20px] relative`}>
				<div className="flex flex-col gap-8 w-full">
					<Link to="/dashboard" className="self-center">
						{isSideExpanded ? (
							<img
								className="w-auto h-8 sm:h-[42px] !cursor-pointer"
								alt="Dark Weather Logo"
								src={`/assets/images/logo-${!isDark ? "dark" : "light"}.svg`}
							/>
						) : (
							<img
								className="w-auto h-8 sm:h-[42px] !cursor-pointer"
								alt="Dark Weather Logo"
								src={`/assets/images/dark-weather${isDark ? "-dark" : ""}.svg`}
							/>
						)}
					</Link>

					<div
						onClick={() => setIsSideExpanded(!isSideExpanded)}
						className="absolute top-[57px] right-[-16px] w-[30px] h-[30px] bg-textDark dark:bg-text rounded-full flex items-center justify-center z-[5] cursor-pointer hover:scale-105 transition-transform">
						<Icon
							icon="arrow-down"
							className={`w-4 h-4 ${isSideExpanded ? "rotate-90" : "-rotate-90"} text-text dark:text-textDark transition-transform`}
						/>
					</div>

					<div className="flex flex-col gap-2">
						{menuItems.map((item, index) => {
							const activeArray = item.active || [item.href];
							const isActive = activeArray.includes(location.pathname);
							return (
								<Link
									key={index}
									to={item.href}
									className={`flex items-center gap-4 px-[18px] py-4 rounded-lg ${isActive ? "bg-primary !text-text" : "text-bgc dark:text-text"
										}`}>
									<Icon
										icon={item.icon}
										className={` shrink-0 w-6 h-6 ${isActive ? "text-text dark:text-textDark" : "text-textDark dark:text-text"}`}
									/>
									{isSideExpanded && (
										<span
											className={`text-sm whitespace-nowrap transition-opacity duration-300 ${isActive ? " text-text dark:text-textDark font-semibold" : "font-medium text-textDark dark:text-text"}`}>
											{item.title}
										</span>
									)}
								</Link>
							);
						})}
					</div>
				</div>

				<Link
					to="/login"
					onClick={() => {
						localStorage.removeItem("auth");
						setUserDetails({});
					}}
					className="flex items-center gap-4 px-4 py-3 w-full text-bgc dark:text-text rounded-lg ">
					<Icon icon="logout" className="w-6 h-6 text-textDark dark:text-text" />
					{isSideExpanded && <span className="text-sm font-medium">Log Out</span>}
				</Link>
			</div>
		</>
	);
}
