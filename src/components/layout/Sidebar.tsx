import Icon from "components/utils/Icon";
import useAppState from "components/utils/useAppState";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";


export default function Sidebar() {
	// Use individual selectors from Zustand store
	const isDark = useAppState(state => state.isDark);
	const setIsDark = useAppState(state => state.setIsDark);
	const userDetails = useAppState(state => state.userDetails);
	const setUserDetails = useAppState(state => state.setUserDetails);
	const isSideExpanded = useAppState(state => state.isSideExpanded);
	const setIsSideExpanded = useAppState(state => state.setIsSideExpanded);
	const isMenuOpen = useAppState(state => state.isMenuOpen);
	const setIsMenuOpen = useAppState(state => state.setIsMenuOpen);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);



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
		{ title: "Role Management", icon: "role-management", href: "role", roles: ["SuperAdmin", "Support"], active: ["/role"] },
		{ title: "API Integration", icon: "api-integration", href: "", roles: ["SuperAdmin"], active: [""] },
		{ title: "Subscription", icon: "subscription", href: "subscription", roles: ["SuperAdmin"], active: ["/subscription"] },
		{
			title: "Posts and Articles",
			icon: "alerts-content-post",
			href: "posts-articles",
			roles: ["SuperAdmin", "Analytics", "Support"],
			active: ["/posts-articles"],
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
			href: "settings-configurations",
			roles: ["SuperAdmin"],
			active: ["/settings-configurations"],
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
			href: "notification",
			roles: ["SuperAdmin", "Support"],
			active: ["/notification"],
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

	// const handleClickOutside = (event: MouseEvent) => {
	// 	if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
	// 		setIsSideExpanded(false);
	// 	}
	// };

	// useEffect(() => {
	// 	if (isSideExpanded) {
	// 		document.addEventListener("mousedown", handleClickOutside);
	// 	} else {
	// 		document.removeEventListener("mousedown", handleClickOutside);
	// 	}

	// 	return () => {
	// 		document.removeEventListener("mousedown", handleClickOutside);
	// 	};
	// }, [isSideExpanded]);


	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);


	return (
		<>
			{/* Mobile hamburger icon (shown only on small screens) */}
			<div
				className="absolute top-3 right-4 z-1000 px-3 lg:min-[1025px]:hidden flex items-center"
				onClick={() => setIsMenuOpen(true)}
			>
			</div>

			{/* Mobile backdrop */}
			{isMenuOpen && windowWidth < 1025 && (
				<div
					onClick={() => setIsMenuOpen(false)}
					className="fixed inset-0"
				/>
			)}

			{/* Mobile drawer */}
			{isMenuOpen && windowWidth < 640 && (
				<div
					ref={sidebarRef}
					className="translate-x-0 lg:min-[1025px]:translate-x-0 top-0 left-0 z-50 transition-transform ease-in-out duration-300 transform fixed block lg:min-[1025px]:hidden"
				>
					<div className="min-w-[306px] max-w-[306px] inline-flex flex-col items-start justify-between px-6 py-8 bg-bgc dark:bg-bgcDark rounded-r-2xl gap-4">
						<div className="flex flex-col w-[255px] items-start gap-8 flex-[0_0_auto]">
							<div
								onClick={() => setIsMenuOpen(false)}
								className="w-10 h-10 flex items-center justify-center shrink-0 absolute top-1 right-2 rounded-full lg:min-[1025px]:hidden"
							>
								<Icon icon="close" className="w-4 h-4 text-text dark:text-textDark" />
							</div>

							<Link to="/">
								<img
									className="w-auto h-12 !cursor-pointer"
									alt="Dark Weather Logo"
									src={`/assets/images/logo-${isDark ? "dark" : "light"}.svg`}
								/>
							</Link>

							<div className="bg-textSecondary/20 dark:!bg-bgc/70 h-[1px] w-full" />

							<nav className="flex flex-col items-start gap-4 w-full h-[calc(100vh-326px)] overflow-auto">
								{menuItems.map((item, index) => {
									const isActive = item.active.includes(location.pathname);
									return (
										<Link
											key={index}
											to={item.href}
											aria-label={item.title}
											onClick={() => setIsMenuOpen(false)}
											className={`text-base font-normal text-text dark:text-textDark leading-[18px] px-4 py-3 rounded-xl transition-colors w-full ${isActive ? "bg-primary !text-text font-semibold" : "bg-transparent"
												}`}
										>
											{item.title}
										</Link>
									);
								})}
							</nav>
						</div>

						<div className="bg-textSecondary/20 dark:bg-bgc/70 h-[1px] w-full" />

						<div className="flex flex-col items-start gap-4 w-full mt-4 overflow-hidden">
							<div
								className="flex items-center gap-2.5 px-6 py-3 h-[42px] cursor-pointer text-text dark:text-textDark"
								onClick={() => {
									const newIsDark = !isDark;
									localStorage.setItem("theme", newIsDark ? "dark" : "light");
									document.documentElement.classList.toggle("dark", newIsDark);
									setIsDark(newIsDark);
								}}

							>
								<div>{isDark ? "Light" : "Dark"} Mode</div>
								<Icon className="w-5 h-5" icon={isDark ? "sun" : "moon"} />
							</div>
							{userDetails?.userId ? (
								<div
									className="flex items-center gap-3 px-6 py-3 h-[42px] cursor-pointer"
									onClick={() => {
										localStorage.removeItem("auth");
										setUserDetails({});
										setIsMenuOpen(false);
									}}
								>
									<img alt="" src="/assets/images/user.png" className="size-8 rounded-full" />
									<div>Logout</div>
								</div>
							) : (
								<Link
									to="/login"
									className="flex justify-center bg-primary items-center h-[42px] px-6 py-3 text-sm font-semibold text-text w-full rounded-md"
									onClick={() => setIsMenuOpen(false)}
								>
									Login
								</Link>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Desktop sidebar */}
			{windowWidth >= 641 && (
				<div
					ref={sidebarRef}
					className={`${isSideExpanded ? "min-w-[330px]" : "w-[108px]"} transition-all duration-300 h-full hidden sm:flex flex-col items-start justify-between p-6 ${isDark ? "bg-white" : "bg-gray-900"}
 gap-4 rounded-[20px] relative`}

				>
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
							className="absolute top-[57px] right-[-16px] w-[30px] h-[30px] bg-textDark dark:bg-text rounded-full flex items-center justify-center z-[5] cursor-pointer hover:scale-105 transition-transform"
						>
							<Icon
								icon="arrow-down"
								className={`w-4 h-4 ${isSideExpanded ? "rotate-90" : "-rotate-90"} text-text dark:text-textDark transition-transform`}
							/>
						</div>

						<div className="flex flex-col gap-2">
							{menuItems.map((item, index) => {
								const isActive = item.active.includes(location.pathname);
								return (
									<Link
										key={index}
										to={item.href}
										className={`flex items-center gap-4 px-[18px] py-4 rounded-lg ${isActive ? "bg-primary !text-text" : "text-bgc dark:text-text"}`}
									>
										<Icon
											icon={item.icon}
											className={`shrink-0 w-6 h-6 ${isActive ? "text-text dark:text-textDark" : "text-textDark dark:text-text"}`}
										/>
										{isSideExpanded && (
											<span
												className={`text-sm whitespace-nowrap transition-opacity duration-300 ${isActive ? "text-text dark:text-textDark font-semibold" : "font-medium text-textDark dark:text-text"}`}
											>
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
						className="flex items-center gap-4 px-4 py-3 w-full text-bgc dark:text-text rounded-lg"
					>
						<Icon icon="logout" className="w-6 h-6 text-textDark dark:text-text" />
						{isSideExpanded && <span className="text-sm font-medium">Log Out</span>}
					</Link>
				</div>
			)}
		</>
	);



}
