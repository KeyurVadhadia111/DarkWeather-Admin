import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Sidebar from "components/common/Sidebar";
import Icon from "components/utils/Icon";
import ProfileMenu from "components/utils/ProfileMenu";
import { useAppState } from "components/utils/useAppState";
import { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
	const [{ isDark, userDetails }, setAppState] = useAppState();

	// Navigation menu items
	const navItems = [
		{ title: "Home", href: "/", authRequired: false },
		{ title: "Radar & Maps", href: "/radar-maps", authRequired: true },
		{ title: "Weather A.I.", href: "/weather-ai", authRequired: false },
		{ title: "Go Premium", href: "/premium-plan", authRequired: true },
		{ title: "Top Stories", href: "/top-stories", authRequired: false },
		{ title: "Severe Weather", href: "/severe-weather", authRequired: false },
	];

	useEffect(() => {
		setAppState({ userDetails: JSON.parse(localStorage.getItem("auth") || "{}") });
		// Check for dark mode preference
		if (localStorage.theme === "dark") {
			setThemeMode(true);
			setAppState({ isDark: true });
		}
		if (window.matchMedia("(prefers-color-scheme: dark)").matches && localStorage?.theme === undefined) {
			setThemeMode(true);
			setAppState({ isDark: true });
		}
	}, []);

	const setThemeMode = (isDark: boolean) => {
		if (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			document.documentElement.classList.add("dark");
			isDark = true;
		}
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		setAppState({ isDark: isDark });
	};

	return (
		<header
			className={`relative sm:z-[1] z-[100] w-full border-b mb-[-1px] shadow-[inset_0px_30px_30px_#ffffff0d] border-white/16 bg-text dark:bg-bgc text-bgc dark:text-text`}>
			<Sidebar />
			<div className="container flex items-center justify-between py-2 sm:py-4">
				<Link to={"/"}>
					<img
						className="w-auto h-8 sm:h-[56px] !cursor-pointer"
						alt="Dark Weather Logo"
						src={`/assets/images/logo-${!isDark ? "dark" : "light"}.svg`}
					/>
				</Link>

				<nav className="items-center gap-7 hidden sm:flex">
					{navItems
						.filter(item => (!userDetails?._id ? !item.authRequired : true))
						.map((item, index) => (
							<Link
								key={index}
								to={item.href}
								aria-label={item.title}
								className="text-base tracking-[0.80px] leading-6 font-normal hover:opacity-90">
								{item.title}
							</Link>
						))}
				</nav>

				<div className="items-center gap-6 hidden sm:flex">
					<div className="flex items-center cursor-pointer">
						<Icon className="w-5 h-5" icon="search" />
					</div>
					<div
						className="flex items-center cursor-pointer"
						onClick={() => {
							localStorage.setItem("theme", !isDark ? "dark" : "light");
							setThemeMode(!isDark);
						}}>
						<Icon className="w-6 h-6" icon={isDark ? "moon" : "sun"} />
					</div>

					{/* Profile dropdown */}
					{userDetails?._id ? (
						<ProfileMenu />
					) : (
						<Link
							to="/login"
							className="flex bg-primary items-center px-8 py-4 text-sm font-semibold text-text rounded-md">
							Login
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
