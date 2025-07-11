import Icon from "components/utils/Icon";
import { Input } from "components/utils/Input";
import ProfileMenu from "components/utils/ProfileMenu";
import useAppState from "components/utils/useAppState";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header() {
	const isDark = useAppState(state => state.isDark);
	const setIsDark = useAppState(state => state.setIsDark);
	const userDetails = useAppState(state => state.userDetails);
	const setUserDetails = useAppState(state => state.setUserDetails);
	const isMenuOpen = useAppState(state => state.isMenuOpen);
	const setIsMenuOpen = useAppState(state => state.setIsMenuOpen);


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
			<div className="sm:hidden flex w-full items-center justify-between px-6 bg-text dark:bg-bgc h-12">
				<div>
					<Link to={"/"}>
						<img
							className="w-auto h-8 sm:h-[42px] !cursor-pointer"
							alt="Dark Weather Logo"
							src={`/assets/images/logo-${!isDark ? "dark" : "light"}.svg`}
						/>
					</Link>
				</div>
				<div className="flex items-center gap-4">
					<Icon icon="search" className="w-6 h-6 text-textDark dark:text-text" />
					<Icon icon="menu" className="w-6 h-6 text-textDark dark:text-text" onClick={() => setIsMenuOpen(!isMenuOpen)} />
				</div>
			</div>

			<div className="hidden sm:flex w-full items-center justify-between p-4 bg-bgc dark:bg-fgcDark mb-4 rounded-[20px]">
				<div className="hidden sm:flex relative items-center justify-between rounded-lg">
					<Input
						className=" font-normal !w-[360px] !h-[50px] text-bgcSecondary dark:text-textDark text-sm whitespace-nowrap [background:transparent] border-[none] p-0  !bg-fgc dark:!bg-bgcDark"
						placeholder="Search here"
						type="text"
					/>

					<Icon icon="search" className="w-5 h-5 text-text dark:text-textDark absolute right-4" />
				</div>

				<div className="flex items-center gap-6">
					<Icon
						onClick={() => {
							localStorage.setItem("theme", !isDark ? "dark" : "light");
							setThemeMode(!isDark);
						}}
						className="w-7 h-7 text-text dark:text-textDark cursor-pointer shrink-0"
						icon={isDark ? "sun" : "moon"}
					/>

					<Icon icon="notification-bing" className="w-7 h-7 text-text dark:text-textDark shrink-0" />
					<ProfileMenu />
				</div>
			</div>
		</>
	);
}
