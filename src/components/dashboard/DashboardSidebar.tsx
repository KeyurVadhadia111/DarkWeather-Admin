import { Button } from "@headlessui/react";
import Icon from "components/utils/Icon";
import useAppState from "components/utils/useAppState";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function DashboardSidebar() {
	// Use individual selectors from Zustand store
	const isDark = useAppState(state => state.isDark);
	const userDetails = useAppState(state => state.userDetails);
	const setUserDetails = useAppState(state => state.setUserDetails);

	const [isOpen, setIsOpen] = useState(true);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	const menuItems = [
		{ title: "Dashboard", icon: "dashboard", href: "/dashboard" },
		{ title: "User Management", icon: "user-management", href: "" },
		{ title: "Override Weather Info", icon: "override-weather-info", href: "" },
		{ title: "Role Management", icon: "role-management", href: "" },
		{ title: "API Integration", icon: "api-integration", href: "" },
		{ title: "Subscription", icon: "subscription", href: "" },
		{ title: "Alerts & Content Post", icon: "alerts-content-post", href: "" },
		{ title: "Social Media Configuration", icon: "social-media-configuration", href: "" },
		{ title: "Settings & Configurations", icon: "settings-configurations", href: "" },
		{ title: "Analytics & Reports", icon: "analytics-reports", href: "" },
		{ title: "Feedback Manager", icon: "feedback-manager", href: "" },
		{ title: "Notification System", icon: "notification-system", href: "" },
		{ title: "Audit Trail System", icon: "audit-trail-system", href: "" },
		{ title: "Data Export & Import", icon: "data-export-import", href: "" },
		{ title: "Scheduled Maintenance", icon: "scheduled-maintenance", href: "" },
	];

	const handleClickOutside = (event: MouseEvent) => {
		if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<>
			<div
				className={`${isOpen ? "w-[330px]" : "w-[100px]"} transition-all duration-300 h-dhv hidden sm:flex flex-col items-start justify-between p-6 bg-text dark:bg-bgc gap-4 rounded-[20px] relative`}>
				<div className="flex flex-col gap-8 w-full">
					<Link to="/dashboard" className="self-center">
						{isOpen ? (
							<img
								className="w-auto h-8 sm:h-[42px] !cursor-pointer"
								alt="Dark Weather Logo"
								src={`/assets/images/logo-${!isDark ? "dark" : "light"}.svg`}
							/>
						) : (
							<img
								className="w-auto h-8 sm:h-[40px] !cursor-pointer"
								alt="Dark Weather Logo"
								src={`/assets/images/dark-weather${isDark ? "-dark" : ""}.svg`}
							/>
						)}
					</Link>

					<div
						onClick={() => setIsOpen(!isOpen)}
						className="absolute top-[57px] right-[-16px] w-[30px] h-[30px] bg-textDark dark:bg-text rounded-full flex items-center justify-center z-[5] cursor-pointer hover:scale-105 transition-transform">
						<Icon
							icon="arrow-down"
							className={`w-4 h-4 ${isOpen ? "rotate-90" : "-rotate-90"} text-text dark:text-textDark transition-transform`}
						/>
					</div>

					<div className="flex flex-col gap-2">
						{menuItems.map((item, index) => {
							const isActive = location.pathname === item.href;
							return (
								<Link
									key={index}
									to={item.href}
									className={`flex items-center gap-4 px-4 py-3 rounded-lg ${
										isActive ? "bg-primary !text-text" : "text-bgc dark:text-text"
									}`}>
									<Icon
										icon={item.icon}
										className={`w-6 h-6 ${isActive ? "text-text dark:text-textDark" : "text-textDark dark:text-text"}`}
									/>
									{isOpen && (
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
					{isOpen && <span className="text-sm font-medium">Log Out</span>}
				</Link>
			</div>
		</>
	);
}
