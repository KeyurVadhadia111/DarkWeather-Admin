import { Button, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Icon from "components/utils/Icon";
import { Separator } from "components/utils/Separator";
import useAppState from "components/utils/useAppState";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import SimpleBar from "simplebar-react";

export default function Sidebar() {
	// Use individual selectors from Zustand store
	const isDark = useAppState(state => state.isDark);
	const setIsDark = useAppState(state => state.setIsDark);
	const userDetails = useAppState(state => state.userDetails);
	const setUserDetails = useAppState(state => state.setUserDetails);

	const [isOpen, setIsOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	const navItems = [
		{ title: "", href: "/", authRequired: false },
		{ title: "", href: "/", authRequired: true },
		{ title: "", href: "/", authRequired: false },
		{ title: "", href: "/", authRequired: true },
		{ title: "", href: "/", authRequired: false },
		{ title: "", href: "/", authRequired: false },
		{ title: "", href: "/", authRequired: true },
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

	useEffect(() => {
		setUserDetails(JSON.parse(localStorage.getItem("auth") || "{}"));
		// Check for dark mode preference
		if (localStorage.theme === "dark") {
			setThemeMode(true);
		}
		if (window.matchMedia("(prefers-color-scheme: dark)").matches && localStorage?.theme === undefined) {
			setThemeMode(true);
		}
	}, [setUserDetails]);

	const setThemeMode = (dark: boolean) => {
		if (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			document.documentElement.classList.add("dark");
			dark = true;
		}
		if (dark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		setIsDark(dark);
	};

	return (
		<>
			<div
				className="absolute top-3 right-4 z-10 px-3 md:hidden flex items-center "
				onClick={() => setIsOpen(!isOpen)}>
				<Icon className="w-6 h-6 text-textDark dark:text-text" icon="hamburger" />
			</div>

			{isOpen && <div className="fixed sm:hidden z-10 h-screen w-full backdrop-blur-xs"></div>}

			<div
				ref={sidebarRef}
				className={`${isOpen ? "translate-x-0" : "-translate-x-full"
					}  sm:translate-x-0 top-0 left-0 z-50 transition-transform ease-in-out duration-300 transform fixed block sm:hidden`}>
				<div className="min-w-[306px] max-w-[306px] inline-flex flex-col items-start justify-between px-6 py-8 bg-bgc dark:bg-bgcDark rounded-r-2xl gap-4">
					<div className="flex flex-col w-[255px] items-start gap-8 flex-[0_0_auto]">
						<div
							onClick={() => setIsOpen(!isOpen)}
							className="w-10 h-10 flex items-center justify-center shrink-0 absolute top-1 right-2 rounded-full sm:hidden">
							<Icon icon="close" className="w-4 h-4 text-text dark:text-textDark" />
						</div>

						<Link to={"/"}>
							<img
								className="w-auto h-12 !cursor-pointer"
								alt="Dark Weather Logo"
								src={`/assets/images/logo-${!isDark ? "light" : "dark"}.svg`}
							/>
						</Link>

						<Separator className="bg-textSecondary/20 dark:!bg-bgc/70 !bg-none" />

						<nav className=" flex flex-col items-start gap-4 w-full h-[calc(100dvh-326px)] overflow-auto">
							{navItems
								.filter(item => (!userDetails?._id ? !item.authRequired : true))
								.map((item, index) => {
									const isActive = location.pathname === item.href;
									return (
										<Link
											key={index}
											to={item.href}
											aria-label={item.title}
											onClick={() => setIsOpen(false)}
											className={`text-base  font-normal text-text dark:text-textDark leading-[18px] px-4 py-3 rounded-xl transition-colors w-full ${isActive ? "bg-primary !text-text font-semibold" : "bg-transparent"
												}`}>
											{item.title}
										</Link>
									);
								})}
						</nav>
					</div>

					<Separator className="bg-textSecondary/20 dark:!bg-bgc/70 !bg-none" />

					<div className="flex flex-col items-start gap-4 w-full flex-[0_0_auto] mt-4 overflow-hidden">
						<div
							className="flex items-center gap-2.5 px-6 py-3 h-[42px] cursor-pointer text-text dark:text-textDark"
							onClick={() => {
								localStorage.setItem("theme", !isDark ? "dark" : "light");
								setThemeMode(!isDark);
							}}>
							<div className="text-text dark:text-textDark">{isDark ? "Light" : "Dark"} Mode</div>
							<div className="flex items-center ">
								<Icon className="w-5 h-5" icon={isDark ? "sun" : "moon"} />
							</div>
						</div>
						{userDetails?._id ? (
							<div className="flex items-center gap-3  px-6 py-3 h-[42px] cursor-pointer">
								<div className=" flex items-center gap-4 rounded-full bg-bgcSecondary dark:bg-bgc border border-text dark:border-bgc text-sm focus:ring-0 focus:outline-hidden cursor-pointer">
									<img alt="" src="/assets/images/user.png" className="size-8 rounded-full" />
								</div>
								<div className="text-text dark:text-textDark"> Logout</div>
							</div>
						) : (
							<Link
								to="/login"
								className="flex justify-center bg-primary items-center h-[42px] px-6 py-3 text-sm font-semibold text-text w-full rounded-md"
								onClick={() => setIsOpen(false)}>
								Login
							</Link>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
