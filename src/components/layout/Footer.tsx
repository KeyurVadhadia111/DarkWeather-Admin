import { Button } from "components/utils/Button";
import Icon from "components/utils/Icon";
import { Separator } from "components/utils/Separator";
import useAppState from "components/utils/useAppState";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Footer() {
	// Use individual selectors from Zustand store
	const isDark = useAppState(state => state.isDark);
	const setIsDark = useAppState(state => state.setIsDark);
	const userDetails = useAppState(state => state.userDetails);
	const premiumStep = useAppState(state => state.premiumStep);

	const [isAuthPage, setIsAuthPage] = useState(false);
	const location = useLocation();

	const socialIcons = [
		{ alt: "Facebook", icon: "facebook", href: "#" },
		{ alt: "Instagram", icon: "instagram", href: "#" },
		{ alt: "X", icon: "x", href: "#" },
		{ alt: "Reddit", icon: "reddit", href: "#" },
		{ alt: "TikTok", icon: "tiktok", href: "#" },
	];

	const quickLinks1 = [
		{ label: "", href: "/" },
		{ label: "", href: "/" },
		{ label: "", href: "/" },
		{ label: "", href: "/" },
		{ label: "", href: "/" },
	];
	const quickLinks2 = [
		{ label: "", href: "/" },
		{ label: "", href: "/" },
		{ label: "", href: "/" },
		{ label: "", href: "/" },
		{ label: "", href: "/" },
	];

	useEffect(() => {
		setIsAuthPage(prev => location.pathname === "/login" || location.pathname === "/forgot-password");
	}, [location.pathname]);

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
		<footer
			className={`flex flex-col w-full items-start relative ${isAuthPage && "overflow-hidden"} pt-0 bg-text dark:bg-bgc text-bgc dark:text-text`}>
			{/* <div
				className={`absolute bottom-0 left-0 w-full h-[702px] scale-x-[-1] overflow-hidden bg-no-repeat bg-bottom rotate-180 bg-[length:450%] ${isAuthPage ? "sm:bg-[length:115%]" : "sm:bg-[length:140%]"} bg-[url('/assets/images/footer-bg.png')]`}
				style={{
					backgroundPosition: "center top", // Center horizontally, align bottom
				}}
			/>
			<div
				className={`absolute w-full ${isAuthPage ? "h-full" : "h-[702px]"} bottom-0 left-0 bg-gradient-to-t from-white/0 to-white dark:from-bgcDark/70 dark:to-bgcDark `}></div> */}

			<div className="container my-6 sm:mt-[72px] sm:mb-12 flex flex-col sm:flex-row gap-4 sm:gap-12 justify-between">
				{/* Left: Logo, newsletter, social */}
				<div className="flex flex-col items-start gap-4 sm:gap-6 w-full sm:w-[32%]">
					{/* Logo */}
					<div className="flex items-center gap-3">
						<Link to={"/"}>
							<img
								className="relative h-8 sm:h-[60px]"
								alt="Dark Weather Logo"
								src={`/assets/images/logo-${!isDark ? "dark" : "light"}.svg`}
							/>
						</Link>
					</div>
					{/* Newsletter */}
					<div className="flex flex-col gap-4">
						<div className="text-xs sm:text-base text-gray-300 dark:text-textSecondary w-[80%] sm:w-full ">
							Enter your email address for receiving valuable newsletter .
						</div>
						<div className="flex gap-3 w-full">
							<input
								type="email"
								placeholder="Enter you email address"
								className="flex-1 px-4 py-[13px] sm:py-3 text-xs sm:text-sm rounded-xl bg-bgc/10 dark:bg-border text-bgc dark:text-text placeholder:text-textSecondary dark:placeholder:text-text outline-none border-none"
							/>
							<Button className="!px-[23px] !py-1 sm:!py-[15px] !rounded-[10px] sm:!rounded-xl">
								<Icon icon="arrow-up" className="rotate-90 w-4 h-4 sm:w-6 sm:h-6" />
							</Button>
						</div>
					</div>
					{/* Social Icons */}
					<div className="flex gap-4 mt-0 sm:mt-[18px]">
						{socialIcons.map(icon => (
							<a
								key={icon.alt}
								href={icon.href}
								className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-[10px] border border-textSecondary/15 hover:bg-textSecondary/15 transition "
								aria-label={icon.alt}
								target="_blank"
								rel="noopener noreferrer">
								<Icon
									icon={icon.icon}
									className="w-[13px] h-[13px] sm:w-[18px] sm:h-[18px] text-bgc dark:text-bgcDark"
								/>
							</a>
						))}
					</div>
				</div>
				{/* Center: Quick Links */}
				<div className="flex flex-col sm:flex-row gap-10 w-full sm:w-[38%] justify-center">
					<div className="text-bgc dark:text-text flex flex-col gap-4 sm:gap-8">
						<div className="font-semibold text-lg sm:text-[20px]">Quick Links</div>
						<div className="flex justify-between gap-0 sm:gap-12">
							<ul className="flex flex-col gap-3 sm:gap-[26px]">
								{quickLinks1.map(link => (
									<li key={link.label}>
										<Link
											to={link.href}
											onClick={() => {
												setTimeout(() => {
													window.scrollTo({ top: 0, behavior: "smooth" });
												}, 100);
											}}
											className="text-sm sm:text-base hover:underline">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
							<ul className="flex flex-col gap-3 sm:gap-[26px]">
								{quickLinks2.map(link => (
									<li key={link.label}>
										<Link
											to={link.href}
											onClick={() => {
												setTimeout(() => {
													window.scrollTo({ top: 0, behavior: "smooth" });
												}, 100);
											}}
											className="text-sm sm:text-base hover:underline">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
				{/* Right: Contact Us */}
				<div className="flex flex-col gap-3 sm:gap-6 w-full sm:w-[30%] text-bgc dark:text-text">
					<div className="font-semibold text-lg sm:text-[20px] mb-1 sm:mb-4">Contact Us</div>
					<div className="flex items-center gap-2.5 sm:gap-3">
						<Icon icon="call-calling" className="w-4 h-4 sm:w-6 sm:h-6" />
						<span className="text-sm sm:text-base">(555) 123-4567</span>
					</div>
					<div className="flex items-center gap-2.5 sm:gap-3">
						<Icon icon="sms" className="w-4 h-4 sm:w-6 sm:h-6" />
						<span className="text-sm sm:text-base">support@darkweather.com</span>
					</div>
					<div className="flex items-start gap-2.5 sm:gap-3">
						<Icon icon="location" className="w-4 h-4 sm:w-6 sm:h-6" />
						<span className="text-sm sm:text-base">
							123 Maplewood Lane
							<br />
							Springfield, IL 62704 USA
						</span>
					</div>
				</div>
			</div>
			<Separator className="bg-textSecondary/20 !bg-none " />
			{/* Copyright Section */}
			<div className="z-[1] px-6 sm:px-[135px] py-4 sm:py-6 flex flex-col items-center relative self-stretch w-full flex-[0_0_auto] text-xs sm:text-base">
				<div className="flex flex-col gap-4 sm:gap-9 sm:flex-row items-center justify-between container">
					<p className="[font-family:'Rubik',Helvetica] font-normal tracking-[0.80px] leading-6">
						© 2025 Dark Weather. All rights reserved.
					</p>

					<div className="flex items-center gap-6">
						<Link
							to={"/privacy-policy"}
							onClick={() => {
								setTimeout(() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}, 100);
							}}
							className="tracking-[0.80px]">
							Privacy Policy
						</Link>
						<Link
							to={"/terms-conditions"}
							onClick={() => {
								setTimeout(() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}, 100);
							}}
							className="tracking-[0.80px]">
							Terms And Conditions
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
