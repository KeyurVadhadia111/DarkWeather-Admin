import Icon from "components/utils/Icon";
import useAppState from "components/utils/useAppState";
import React, { JSX, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import MiniLineChart from "components/dashboard/MiniLineChart";
import UserTrafficBarChart from "components/dashboard/UserTrafficBarChart";
import FeaturesBarChart from "components/dashboard/FeaturesBarChart";
import SubscriptionPieChart from "components/dashboard/SubscriptionPieChart";

const Dashboard = (): JSX.Element => {
	// Use individual selectors from Zustand store
	const isDark = useAppState(state => state.isDark);
	const premiumStep = useAppState(state => state.premiumStep);
	const userDetails = useAppState(state => state.userDetails);

	const [selected, setSelected] = useState("Weekly");
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const formats = ["Weekly", "Monthly", "Yearly"];

	const activeUsersData = [
		{ value: 4000 },
		{ value: 5000 },
		{ value: 4800 },
		{ value: 6000 },
		{ value: 5500 },
		{ value: 7000 },
		{ value: 8456 },
	];

	const weatherRequestData = [
		{ value: 4000 },
		{ value: 5000 },
		{ value: 4800 },
		{ value: 6000 },
		{ value: 5500 },
		{ value: 7000 },
		{ value: 8456 },
	];

	const systemHealthData = [
		{ value: 4000 },
		{ value: 5000 },
		{ value: 4800 },
		{ value: 6000 },
		{ value: 5500 },
		{ value: 7000 },
		{ value: 8456 },
	];

	const aiChatRequestData = [
		{ value: 4000 },
		{ value: 5000 },
		{ value: 4800 },
		{ value: 6000 },
		{ value: 5500 },
		{ value: 7000 },
		{ value: 8456 },
	];

	const premiumConversionData = [
		{ value: 4000 },
		{ value: 5000 },
		{ value: 4800 },
		{ value: 6000 },
		{ value: 5500 },
		{ value: 7000 },
		{ value: 8456 },
	];

	const inactiveUsersData = [
		{ value: 4000 },
		{ value: 5000 },
		{ value: 4800 },
		{ value: 6000 },
		{ value: 5500 },
		{ value: 7000 },
		{ value: 8456 },
	];

	const dashboardCards = [
		{
			icon: <Icon icon="active-users" className="w-[10.23px] h-[10.23px] sm:w-[18px] sm:h-[18px]" />,
			value: "8,456",
			change: "+8%",
			changeIcon: "arrow-up-small",
			label: "Active Users",
			chart: <MiniLineChart data={activeUsersData} color="#ffa500" />,
			color: "#22BD22",
		},
		{
			icon: <Icon icon="live-weather-request" className="w-[10.23px] h-[10.23px] sm:w-[18px] sm:h-[18px]" />,
			value: "4,348",
			change: "+12.4%",
			changeIcon: "arrow-up-small",
			label: "Live Weather Request",
			chart: <MiniLineChart data={weatherRequestData} color="#ffa500" />,
			color: "#22BD22",
		},
		{
			icon: <Icon icon="system-health" className="w-[10.23px] h-[10.23px] sm:w-[18px] sm:h-[18px]" />,
			value: "99.00%",
			change: "+8%",
			changeIcon: "arrow-up-small",
			label: "System Health",
			chart: <MiniLineChart data={systemHealthData} color="#ffa500" />,
			color: "#22BD22",
		},
		{
			icon: <Icon icon="total-ai-chat-request" className="w-[10.23px] h-[10.23px] sm:w-[18px] sm:h-[18px]" />,
			value: "2,232",
			change: "+16%",
			changeIcon: "arrow-up-small",
			label: "Total Ai Chat Request",
			chart: <MiniLineChart data={aiChatRequestData} color="#ffa500" />,
			color: "#22BD22",
		},
		{
			icon: <Icon icon="free-premium-conversion" className="w-[10.23px] h-[10.23px] sm:w-[18px] sm:h-[18px]" />,
			value: "48%",
			change: "+8%",
			changeIcon: "arrow-up-small",
			label: "Free To Premium Conversion",
			chart: <MiniLineChart data={premiumConversionData} color="#ffa500" />,
			color: "#22BD22",
		},
		{
			icon: <Icon icon="total-inactive-users" className="w-[10.23px] h-[10.23px] sm:w-[18px] sm:h-[18px]" />,
			value: "956",
			change: "-6%",
			changeIcon: "arrow-down-small",
			label: "Total Inactive Users",
			chart: <MiniLineChart data={inactiveUsersData} color="#e95478" />,
			color: "#E95478",
		},
	];

	const topUsers = [
		{
			rank: 1,
			name: "John Doe",
			last10: 54,
			last15: 932,
			allTime: "2,341",
		},
		{
			rank: 2,
			name: "Maria Smith",
			last10: 51,
			last15: 871,
			allTime: "1,987",
		},
		{
			rank: 3,
			name: "Robert Johnson",
			last10: 48,
			last15: 812,
			allTime: "1,432",
		},
		{
			rank: 4,
			name: "Alice Thomas",
			last10: 42,
			last15: 786,
			allTime: "1,205",
		},
		{
			rank: 5,
			name: "Michael Green",
			last10: 27,
			last15: 602,
			allTime: "988",
		},
	];

	const mostSearchedCities = [
		{ rank: 1, city: "Aksu, China", requests: "2,341" },
		{ rank: 2, city: "Shuangyashan, China", requests: "1,987" },
		{ rank: 3, city: "Tlajomulco De Zuniga, Mexico", requests: "1,432" },
		{ rank: 4, city: "Wuyuan, China", requests: "1,205" },
		{ rank: 5, city: "Cuernavaca, Mexico", requests: "988" },
	];

	const loginActivityLogs = [
		{
			user: "Wade Warren",
			email: "wadewarren16@gmail.com",
			location: "20th Street, Los Angeles",
			datetime: "2025-05-01, 08:30AM",
			avatar: "/assets/images/wade-warren.svg",
		},
		{
			user: "Darrell Steward",
			email: "darrellsteward21@gmail.com",
			location: "Pearl Street, Pomona",
			datetime: "2025-05-01, 10:15AM",
			avatar: "/assets/images/darrell-steward.svg",
		},
		{
			user: "Devon Lane",
			email: "devonlane5@gmail.com",
			location: "Tlajomulco Zuniga, Mexico",
			datetime: "2025-05-01, 11:30AM",
			avatar: "/assets/images/devon-lane.svg",
		},
		{
			user: "Jenny Wilson",
			email: "jennywilson06@gmail.com",
			location: "Hoefner Avenue, Los Angeles",
			datetime: "2025-05-01, 01:45PM",
			avatar: "/assets/images/jenny-wilson.svg",
		},
		{
			user: "Floyd Miles",
			email: "floydmiles31@gmail.com",
			location: "Cuernavaca, Mexico",
			datetime: "2025-05-01, 03:12PM",
			avatar: "/assets/images/floyd-miles.svg",
		},
	];

	const notifications = [
		{
			icon: "email-sent",
			title: "Daily Summary Email Sent",
			description: "The Daily Summary Email was successfully sent to all users",
			time: "Today, 08:01 AM",
		},
		{
			icon: "scheduled",
			title: "Broadcast Scheduled",
			description: "New broadcast ‘System Maintenance Alert’ is scheduled for May 31, 10:00 PM.",
			time: "Today, 12:15 PM",
		},
		{
			icon: "severe-warning",
			title: "Severe Thunderstorm Warning",
			description: "Thunderstorm warning issued for South Zone. Broadcast sent to affected users.",
			time: "Today, 04:50 PM",
		},
		{
			icon: "rainfall",
			title: "Rainfall Forecast Update",
			description: "Rainfall predictions updated based on latest satellite data.",
			time: "Today, 06:45 AM",
		},
		{
			icon: "cancelled",
			title: "Broadcast Cancelled",
			description: "Rainfall predictions updated based on latest satellite data.",
			time: "Today, 06:45 AM",
		},
		{
			icon: "email-sent",
			title: "Daily Summary Email Sent",
			description: "The Daily Summary Email was successfully sent to all users",
			time: "Today, 08:01 AM",
		},
		{
			icon: "scheduled",
			title: "Broadcast Scheduled",
			description: "New broadcast ‘System Maintenance Alert’ is scheduled for May 31, 10:00 PM.",
			time: "Today, 12:15 PM",
		},
		{
			icon: "severe-warning",
			title: "Severe Thunderstorm Warning",
			description: "Thunderstorm warning issued for South Zone. Broadcast sent to affected users.",
			time: "Today, 04:50 PM",
		},
		{
			icon: "rainfall",
			title: "Rainfall Forecast Update",
			description: "Rainfall predictions updated based on latest satellite data.",
			time: "Today, 06:45 AM",
		},
		{
			icon: "cancelled",
			title: "Broadcast Cancelled",
			description: "Rainfall predictions updated based on latest satellite data.",
			time: "Today, 06:45 AM",
		},
	];

	const alertsAndPosts = [
		{
			img: "/assets/images/rain-img.svg",
			title: "Rain-wrapped tornadoes hit Texas and Arkansas",
			description:
				"Rain-wrapped tornadoes struck parts of Texas and Arkansas, making them especially dangerous as the heavy rain concealed.",
		},
		{
			img: "/assets/images/food-truck-img.svg",
			title: "Food truck owner drives an hour to feed survivors.",
			description:
				"A kind-hearted food truck owner drove over an hour to Selmer to help feed survivors affected by the disaster. Offering free meals.",
		},
		{
			img: "/assets/images/tornado-img.svg",
			title: "Tornado supercells sweep through Ark-La-Tex.",
			description:
				"Tornado-warned supercells tore through the Ark-La-Tex region, bringing intense winds, hail, and the threat of multiple tornadoes.",
		},
		{
			img: "/assets/images/rain-img.svg",
			title: "Rain-wrapped tornadoes hit Texas and Arkansas",
			description:
				"Rain-wrapped tornadoes struck parts of Texas and Arkansas, making them especially dangerous as the heavy rain concealed.",
		},
		{
			img: "/assets/images/food-truck-img.svg",
			title: "Food truck owner drives an hour to feed survivors.",
			description:
				"A kind-hearted food truck owner drove over an hour to Selmer to help feed survivors affected by the disaster. Offering free meals.",
		},
		{
			img: "/assets/images/tornado-img.svg",
			title: "Tornado supercells sweep through Ark-La-Tex.",
			description:
				"Tornado-warned supercells tore through the Ark-La-Tex region, bringing intense winds, hail, and the threat of multiple tornadoes.",
		},
		{
			img: "/assets/images/rain-img.svg",
			title: "Rain-wrapped tornadoes hit Texas and Arkansas",
			description:
				"Rain-wrapped tornadoes struck parts of Texas and Arkansas, making them especially dangerous as the heavy rain concealed.",
		},
		{
			img: "/assets/images/food-truck-img.svg",
			title: "Food truck owner drives an hour to feed survivors.",
			description:
				"A kind-hearted food truck owner drove over an hour to Selmer to help feed survivors affected by the disaster. Offering free meals.",
		},
		{
			img: "/assets/images/tornado-img.svg",
			title: "Tornado supercells sweep through Ark-La-Tex.",
			description:
				"Tornado-warned supercells tore through the Ark-La-Tex region, bringing intense winds, hail, and the threat of multiple tornadoes.",
		},
		{
			img: "/assets/images/rain-img.svg",
			title: "Rain-wrapped tornadoes hit Texas and Arkansas",
			description:
				"Rain-wrapped tornadoes struck parts of Texas and Arkansas, making them especially dangerous as the heavy rain concealed.",
		},
		{
			img: "/assets/images/food-truck-img.svg",
			title: "Food truck owner drives an hour to feed survivors.",
			description:
				"A kind-hearted food truck owner drove over an hour to Selmer to help feed survivors affected by the disaster. Offering free meals.",
		},
		{
			img: "/assets/images/tornado-img.svg",
			title: "Tornado supercells sweep through Ark-La-Tex.",
			description:
				"Tornado-warned supercells tore through the Ark-La-Tex region, bringing intense winds, hail, and the threat of multiple tornadoes.",
		},
	];

	// Role-based filtering
	const role = userDetails?.role || "SuperAdmin";
	const supportCardLabels = ["Active Users", "Total Inactive Users", "Free To Premium Conversion"];
	const analyticsCardLabels = [
		"Active Users",
		"Live Weather Request",
		"System Health",
		"Total Ai Chat Request",
		"Free To Premium Conversion",
		"Total Inactive Users",
	];

	let visibleDashboardCards = dashboardCards;
	if (role === "Support") {
		visibleDashboardCards = dashboardCards.filter(card => supportCardLabels.includes(card.label));
	} else if (role === "Analytics") {
		visibleDashboardCards = dashboardCards.filter(card => analyticsCardLabels.includes(card.label));
	}

	return (
		<div className="flex flex-col items-start gap-5 sm:gap-6 p-2.5 sm:p-6 bg-bgc dark:bg-fgcDark rounded-[10px] sm:rounded-[20px] relative z-[1] w-full">
			<div className="flex flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
				<div className="flex h-[42px] sm:h-14 items-center justify-between relative self-stretch w-full">
					<div className="relative w-fit font-medium text-text dark:text-textDark text-xl sm:text-[28px] tracking-[0] sm:leading-7 whitespace-nowrap">
						Dashboard Overview
					</div>
					{role !== "Support" && (
						<div className="relative" ref={dropdownRef}>
							<button
								className="flex items-center font-normal bg-bgc dark:bg-bgcDark backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-5 py-[10px] sm:py-3 text-sm sm:text-lg text-text dark:text-textDark border border-textSecondary/20"
								onClick={() => setDropdownOpen(!dropdownOpen)}>
								<span>{selected}</span>
								<Icon icon="chevron-down" className="w-4 h-4 ml-2" />
							</button>
							{dropdownOpen && (
								<div className="absolute mt-2 w-full bg-bgc dark:bg-text text-bgcDark dark:text-textDark   rounded-md shadow-[0_20px_35px_rgba(0,0,0,0.05)] border border-gray-300 dark:border-gray-600 z-10">
									{formats.map(format => (
										<div
											key={format}
											onClick={() => {
												setSelected(format);
												setDropdownOpen(false);
											}}
											className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-textDark">
											{format}
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 items-center gap-4 sm:gap-6 w-full h-full">
					{visibleDashboardCards.map((card, idx) => (
						<div
							key={idx}
							className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 p-3 sm:p-5  bg-fgc dark:bg-bgcDark rounded-2xl overflow-hidden self-stretch">
							<div className="flex flex-col items-start gap-3 sm:gap-6 flex-[0_0_auto]">
								<div className="flex items-center justify-center w-6 h-6 sm:w-[42px] sm:h-[42px] bg-text dark:bg-textDark text-textDark dark:text-text rounded-lg overflow-hidden">
									{card.icon}
								</div>
								<div className="flex flex-col items-start gap-1.5 sm:gap-3 flex-[0_0_auto]">
									<div className="flex items-center gap-3 flex-[0_0_auto]">
										<div className=" font-medium text-text dark:text-textDark text-base  sm:text-2xl sm:leading-9 w-fit tracking-[0] whitespace-nowrap">
											{card.value}
										</div>
										<div className="flex items-center gap-0.5 flex-[0_0_auto]">
											<div className=" font-normal text-textSecondary text-xs sm:text-base sm:leading-6 w-fit tracking-[0] whitespace-nowrap">
												{card.change}
											</div>
											<Icon
												icon={card.changeIcon}
												className={`w-3 h-3 sm:w-[18px] sm:h-[18px]`}
												style={{ color: card.color }}
											/>
										</div>
									</div>
									<div className="w-full font-normal text-textSecondary text-xs sm:text-lg tracking-[0] leading-[150%] sm:leading-[27px]">
										{card.label}
									</div>
								</div>
							</div>
							<div className="flex items-center w-[96px] h-[48px] sm:w-[161.62px] sm:h-[80.81px] self-center">
								{card.chart}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* SuperAdmin: Show all sections */}
			{role === "SuperAdmin" && (
				<>
					<div className="flex flex-col sm:flex-row items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
						<div className="flex flex-col items-start gap-3 sm:gap-4 relative   w-full">
							<div className="self-stretch  font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[21px] sm:leading-[31.2px] relative tracking-[0]">
								User Traffic
							</div>
							<div className="flex flex-col items-center gap-3 p-4 sm:p-5 relative self-stretch w-full flex-[0_0_auto] bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d] text-[8px] sm:text-sm h-[178px] sm:h-[360px] shrink-0 ">
								<UserTrafficBarChart />
							</div>
						</div>
						<div className="flex flex-col w-full sm:w-[482px] items-start gap-3 sm:gap-4 relative self-stretch">
							<div className="self-stretch  font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[21px] sm:leading-[31.2px] relative tracking-[0]">
								Most Accessed Features
							</div>
							<div className="flex flex-col items-center justify-center gap-3 p-4 sm:px-5 sm:py-6 bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d] relative self-stretch w-full">
								<FeaturesBarChart />
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row items-center gap-6 relative self-stretch flex-[0_0_auto]">
						<div className="flex flex-col w-full sm:max-w-[482px] items-start gap-4">
							<div className="self-stretch font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[21px] sm:leading-[31.2px] relative tracking-[0]">
								User Subscribed For
							</div>
							<div className="flex flex-col items-center justify-center gap-3 p-4 sm:p-5 relative  self-stretch w-full  bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
								<SubscriptionPieChart />
							</div>
						</div>
						<div className="flex flex-col items-start gap-4 relative w-full sm:w-[calc(100%-506px)] ">
							<div className="self-stretch font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[21px] sm:leading-[31.2px] relative tracking-[0]">
								Top Users
							</div>
							<SimpleBar className="w-full bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
								<div className="flex flex-col items-start gap-2.5 p-4 w-[488px] sm:w-full">
									<div className="flex flex-col items-start sm:gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
										<div className="flex h-[42px] sm:h-[52px] items-start sm:justify-between relative self-stretch w-full bg-fgc dark:bg-fgcDark rounded-xl">
											<div className="flex flex-col w-[56px] sm:w-[94px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													Rank
												</div>
											</div>
											<div className="flex-col w-[120px] sm:w-[250px] justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 flex items-start relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													Name
												</div>
											</div>
											<div className="flex flex-col w-[100px] sm:w-[140px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													Last 10 Days
												</div>
											</div>
											<div className="flex flex-col w-[100px] sm:w-[140px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													Last 15 Days
												</div>
											</div>
											<div className="flex flex-col w-[80px] sm:w-[120px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													All Time
												</div>
											</div>
										</div>
										{topUsers.map((user, idx) => (
											<React.Fragment key={user.rank}>
												<div className="flex h-[42px] sm:h-11 items-start sm:justify-between relative self-stretch w-full">
													<div className="flex flex-col w-[56px] sm:w-[82px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
														<div className="relative font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
															{user.rank}
														</div>
													</div>
													<div className="flex flex-col w-[120px] sm:w-[250px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
														<div className="relative font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
															{user.name}
														</div>
													</div>
													<div className="flex flex-col w-[100px] sm:w-[140px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
														<div className="relative font-normal text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
															{user.last10}
														</div>
													</div>
													<div className="flex flex-col w-[100px] sm:w-[140px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
														<div className="relative font-normal text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
															{user.last15}
														</div>
													</div>
													<div className="flex flex-col w-[80px] sm:w-[120px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5  self-stretch">
														<div className=" font-normal text-text dark:text-textDark  text-xs sm:text-base text-center leading-6  w-fit tracking-[0] whitespace-nowrap">
															{user.allTime}
														</div>
													</div>
												</div>
												{idx < topUsers.length - 1 && (
													<div className="w-full h-px bg-textSecondary/10 dark:bg-textSecondary/25" />
												)}
											</React.Fragment>
										))}
									</div>
								</div>
							</SimpleBar>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
						<div className="flex flex-col  w-full flex-1 items-start gap-4">
							<div className="self-stretch font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[21px] sm:leading-[31.2px] relative tracking-[0]">
								Most Search Cities
							</div>
							<SimpleBar className=" w-full bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
								<div className="flex flex-col items-start gap-2.5 p-4 w-[420px] sm:w-full ">
									<div className="flex flex-col items-start sm:gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
										<div className="h-[42px] sm:h-[52px] w-full bg-fgc dark:bg-fgcDark rounded-xl flex items-start relative self-stretch">
											<div className="flex flex-col w-[56px] sm:w-[94px] items-start justify-center gap-2.5 p-3  sm:px-6 sm:py-3.5 relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													Rank
												</div>
											</div>
											<div className="flex-col justify-center gap-2.5 w-[198px] sm:w-[429px] p-4 sm:px-6 sm:py-3.5 flex items-start relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													City
												</div>
											</div>
											<div className="flex flex-col w-[124px] sm:w-[180px] items-start justify-center gap-2.5 p-4 sm:px-6 sm:py-3.5 relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													Requests Today
												</div>
											</div>
										</div>
										{mostSearchedCities.map((item, idx) => (
											<React.Fragment key={item.rank}>
												<div className="flex h-11 items-start relative self-stretch w-full">
													<div className="w-[56px] h-[42px] sm:h-11 sm:w-[94px] flex flex-col  items-start justify-center gap-2.5 p-4 sm:px-6 sm:py-4 relative">
														<div className="relative font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
															{item.rank}
														</div>
													</div>
													<div className="flex flex-col w-[198px] sm:w-[429px] h-[42px] sm:h-11 items-start justify-center gap-2.5 p-4 sm:px-6 sm:py-4 relative">
														<div className="relative font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
															{item.city}
														</div>
													</div>
													<div className="w-[124px] sm:w-[180px] flex flex-col h-[42px] sm:h-11 items-start justify-center gap-2.5 p-4 sm:px-6 sm:py-4 relative">
														<div className="mt-[-7.00px] mb-[-5.00px] font-normal text-text dark:text-textDark text-xs sm:text-base text-center leading-6 relative w-fit tracking-[0] whitespace-nowrap">
															{item.requests}
														</div>
													</div>
												</div>
												{idx < mostSearchedCities.length - 1 && (
													<div className="w-full h-px bg-textSecondary/10 dark:bg-textSecondary/25" />
												)}
											</React.Fragment>
										))}
									</div>
								</div>
							</SimpleBar>
						</div>
						<div className="flex flex-col  w-full flex-1 items-start gap-4 ">
							<div className="self-stretch font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[21px] sm:leading-[31.2px] relative tracking-[0] whitespace-nowrap">
								Alerts &amp; Post
							</div>
							<SimpleBar className="flex flex-col items-stretch p-3 sm:p-4 bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d] relative w-full h-[392px] sm:h-[362px]">
								{alertsAndPosts.map((item, idx) => (
									<React.Fragment key={idx}>
										<div className="flex items-start sm:items-center gap-3.5 w-full">
											<img
												className="relative w-12 h-12 sm:w-20 sm:h-20 object-cover"
												alt="Image"
												src={item.img}
											/>
											<div className="flex flex-col items-start gap-1 sm:gap-2 ">
												<p className="font-medium text-text dark:text-textDark text-sm sm:text-lg tracking-[0] leading-[23.4px]">
													{item.title}
												</p>
												<p className="font-normal text-textSecondary text-xs sm:text-sm tracking-[-0.3px] sm:tracking-[0] sm:leading-[21px]">
													{item.description}
												</p>
											</div>
										</div>
										{idx < alertsAndPosts.length - 1 && (
											<div className="w-full h-px bg-textSecondary/10 dark:bg-textSecondary/25 shrink-0 my-2 sm:my-[21.5px]" />
										)}
									</React.Fragment>
								))}
							</SimpleBar>
						</div>
					</div>
				</>
			)}

			{/* Analytics: Show User Traffic, User Subscribed For, Top Users */}
			{role === "Analytics" && (
				<>
					<div className="flex flex-col sm:flex-row items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
						<div className="flex flex-col items-start gap-4 relative   w-full">
							<div className="self-stretch  font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[31.2px] relative tracking-[0]">
								User Traffic
							</div>
							<div className="flex flex-col items-center gap-3 p-4 sm:p-5 relative self-stretch w-full flex-[0_0_auto] bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d] text-[8px] sm:text-sm h-[178px] sm:h-[360px] shrink-0 ">
								<UserTrafficBarChart />
							</div>
						</div>
						<div className="flex flex-col w-full sm:w-[482px] items-start gap-3 sm:gap-4 relative self-stretch">
							<div className="self-stretch  font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[31.2px] relative tracking-[0]">
								Most Accessed Features
							</div>
							<div className="flex flex-col items-center justify-center gap-3 p-4 sm:px-5 sm:py-6   bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d] relative self-stretch w-full">
								<FeaturesBarChart />
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row items-center gap-6 relative self-stretch flex-[0_0_auto]">
						<div className="flex flex-col w-full sm:max-w-[482px] items-start gap-4">
							<div className="self-stretch  font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[31.2px] relative tracking-[0]">
								User Subscribed For
							</div>
							<div className="flex flex-col items-center justify-center gap-3 p-4 sm:p-5 relative  self-stretch w-full  bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
								<SubscriptionPieChart />
							</div>
						</div>
						<div className="flex flex-col items-start gap-4 relative w-full sm:w-[calc(100%-506px)] ">
							<div className="self-stretch font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[21px] sm:leading-[31.2px] relative tracking-[0]">
								Top Users
							</div>
							<SimpleBar className="w-full bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
								<div className="flex flex-col items-start gap-2.5 p-4 w-[488px] sm:w-full">
									<div className="flex flex-col items-start sm:gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
										<div className="flex h-[42px] sm:h-[52px] items-start sm:justify-between relative self-stretch w-full bg-fgc dark:bg-fgcDark rounded-xl">
											<div className="flex flex-col w-[56px] sm:w-[94px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													Rank
												</div>
											</div>
											<div className="flex-col w-[120px] sm:w-[250px] justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 flex items-start relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													Name
												</div>
											</div>
											<div className="flex flex-col w-[100px] sm:w-[140px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													Last 10 Days
												</div>
											</div>
											<div className="flex flex-col w-[100px] sm:w-[140px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													Last 15 Days
												</div>
											</div>
											<div className="flex flex-col w-[80px] sm:w-[120px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
												<div className="relative w-fit font-medium text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
													All Time
												</div>
											</div>
										</div>
										{topUsers.map((user, idx) => (
											<React.Fragment key={user.rank}>
												<div className="flex h-[42px] sm:h-11 items-start sm:justify-between relative self-stretch w-full">
													<div className="flex flex-col w-[56px] sm:w-[82px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
														<div className="relative font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
															{user.rank}
														</div>
													</div>
													<div className="flex flex-col w-[120px] sm:w-[250px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
														<div className="relative font-normal text-text dark:text-textDark text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
															{user.name}
														</div>
													</div>
													<div className="flex flex-col w-[100px] sm:w-[140px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
														<div className="relative font-normal text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
															{user.last10}
														</div>
													</div>
													<div className="flex flex-col w-[100px] sm:w-[140px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5 relative self-stretch">
														<div className="relative font-normal text-text dark:text-textDark  text-xs sm:text-base text-center tracking-[0] leading-6 whitespace-nowrap">
															{user.last15}
														</div>
													</div>
													<div className="flex flex-col w-[80px] sm:w-[120px] items-start justify-center gap-2.5 p-3 sm:px-6 sm:py-3.5  self-stretch">
														<div className=" font-normal text-text dark:text-textDark  text-xs sm:text-base text-center leading-6  w-fit tracking-[0] whitespace-nowrap">
															{user.allTime}
														</div>
													</div>
												</div>
												{idx < topUsers.length - 1 && (
													<div className="w-full h-px bg-textSecondary/10 dark:bg-textSecondary/25" />
												)}
											</React.Fragment>
										))}
									</div>
								</div>
							</SimpleBar>
						</div>
					</div>
				</>
			)}

			{/* Support: Only show Alerts & Post */}
			{role === "Support" && (
				<>
					<div className="flex flex-col items-start gap-4 relative  self-stretch ">
						<div className="w-full flex items-center justify-between">
							<div className="self-stretch font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[21px] sm:leading-[31.2px] relative tracking-[0] whitespace-nowrap">
								Login Activity Logs
							</div>
							<button className="text-sm sm:text-lg font-semibold text-primary">View All</button>
						</div>
						<SimpleBar className="w-full bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d] p-4 pb-[2px]">
							<table className="table-fixed w-full text-left">
								<thead>
									<tr className="bg-fgc dark:bg-fgcDark text-text dark:text-textDark text-xs sm:text-base">
										<th className="px-4 py-[7px] sm:py-3.5 sm:px-3 font-medium w-[156px] sm:w-auto rounded-l-xl">
											User
										</th>
										<th className="px-4 py-[7px] sm:py-3.5 sm:px-3 font-medium w-[192px] sm:w-auto">
											Email
										</th>
										<th className="px-4 py-[7px] sm:py-3.5 sm:px-3 font-medium w-[196px] sm:w-auto">
											Location
										</th>
										<th className="px-4 py-[7px] sm:py-3.5 sm:px-3 font-medium w-[157px] sm:w-auto rounded-r-xl">
											Date &amp; Time
										</th>
									</tr>
								</thead>
								<tbody>
									{loginActivityLogs.map((log, idx) => (
										<tr
											key={idx}
											className="border-b border-textSecondary/10 dark:border-textSecondary/25 last:border-0 text-text dark:text-textDark text-xs sm:text-base">
											<td className="py-3 sm:py-3.5 px-3 w-[156px] sm:w-auto flex items-center gap-2">
												<img
													src={log.avatar}
													alt={log.user}
													className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
												/>
												<span>{log.user}</span>
											</td>
											<td className="py-3.5 px-3 w-[192px] sm:w-auto">{log.email}</td>
											<td className="py-3.5 px-3 w-[196px] sm:w-auto">{log.location}</td>
											<td className="py-3.5 px-3 w-[157px] sm:w-auto">{log.datetime}</td>
										</tr>
									))}
								</tbody>
							</table>
						</SimpleBar>
					</div>

					<div className="flex flex-col sm:flex-row items-start gap-6 relative w-full flex-[0_0_auto]">
						<div className="flex flex-col items-start gap-4 relative w-full">
							<div className="self-stretch font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[21px] sm:leading-[31.2px] relative tracking-[0] whitespace-nowrap">
								Notifications
							</div>
							<SimpleBar className="w-full rounded-2xl shadow-[0px_10px_65px_#0000000d] p-4 bg-bgc dark:bg-bgcDark h-[530px]">
								{notifications.map((item, idx) => (
									<div
										key={idx}
										className={`flex items-start justify-between gap-2 sm:gap-4 py-3 sm:py-4 ${idx !== notifications.length - 1 ? "border-b border-textSecondary/10 dark:border-textSecondary/25" : ""}`}>
										<div className="flex items-start gap-3 w-full">
											<div className="flex items-center justify-center w-6 h-6 sm:w-[38px] sm:h-[38px] bg-text dark:bg-textDark text-textDark dark:text-text rounded-lg overflow-hidden shrink-0">
												<Icon
													icon={item.icon}
													className="w-3 h-3 sm:w-[19px] sm:h-[19px] text-textDark dark:text-text"
												/>
											</div>
											<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 w-full">
												<div>
													<div className="font-medium text-text dark:text-textDark text-sm sm:text-lg">
														{item.title}
													</div>
													<div className="text-textSecondary dark:text-textDark text-xs sm:text-sm mt-1 w-full sm:w-[280px]">
														{item.description}
													</div>
												</div>
												<div className="text-text dark:text-textDark text-xs sm:text-sm whitespace-nowrap mt-1">
													{item.time}
												</div>
											</div>
										</div>
									</div>
								))}
							</SimpleBar>
						</div>
						<div className="flex flex-col items-start gap-4 relative w-full">
							<div className="self-stretch font-medium text-text dark:text-textDark text-base sm:text-2xl leading-[21px] sm:leading-[31.2px] relative tracking-[0] whitespace-nowrap">
								Alerts &amp; Post
							</div>
							<SimpleBar className="flex flex-col items-stretch p-3 sm:p-4 bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d] relative w-full h-[530px]">
								{alertsAndPosts.map((item, idx) => (
									<React.Fragment key={idx}>
										<div className="flex items-start sm:items-center gap-3.5 w-full">
											<img
												className="relative w-12 h-12 sm:w-20 sm:h-20 object-cover"
												alt="Image"
												src={item.img}
											/>
											<div className="flex flex-col items-start gap-1 sm:gap-2 ">
												<p className="font-medium text-text dark:text-textDark text-sm sm:text-lg tracking-[0] leading-[23.4px]">
													{item.title}
												</p>
												<p className="font-normal text-textSecondary text-xs sm:text-sm tracking-[-0.3px] sm:tracking-[0] sm:leading-[21px]">
													{item.description}
												</p>
											</div>
										</div>
										{idx < alertsAndPosts.length - 1 && (
											<div className="w-full h-px bg-textSecondary/10 dark:bg-textSecondary/25 shrink-0 my-2 sm:my-[21.5px]" />
										)}
									</React.Fragment>
								))}
							</SimpleBar>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Dashboard;
