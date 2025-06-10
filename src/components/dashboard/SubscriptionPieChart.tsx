import useAppState from "components/utils/useAppState";
import React from "react";

const data = [
	{ name: "Severe Weather Alerts", value: 40, color: "#FFFBF4", colorDark: "#3D3423" },
	{ name: "Daily\\Weekly Forecast", value: 30, color: "#FFF5F8", colorDark: "#3A2B2F" },
	{ name: "Location Based Alerts", value: 20, color: "#F4FCFF", colorDark: "#25363D" },
	{ name: "Others", value: 10, color: "#FFF6FF", colorDark: "#352936" },
];

const SubscriptionPieChart: React.FC = () => {
	const isDark = useAppState(state => state.isDark);
	return (
		<div className="flex flex-col gap-4 w-full">
			{data.map((item, idx) => (
				<div
					key={item.name}
					className="flex items-center justify-between rounded-xl px-4 py-[11px] sm:px-5 sm:py-4"
					style={{ background: !isDark ? item.color : item.colorDark }}>
					<span className="font-normal text-xs sm:text-base text-text dark:text-textDark">{item.name}</span>
					<span className="font-medium text-sm sm:text-lg text-text dark:text-textDark">{item.value}%</span>
				</div>
			))}
		</div>
	);
};

export default SubscriptionPieChart;
