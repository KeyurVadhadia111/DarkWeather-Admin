import React from "react";

const data = [
	{ name: "Live Radar", value: 40, color: "#ffa500" },
	{ name: "AI Assistant", value: 30, color: "#e95478" },
	{ name: "Hourly Forecast", value: 20, color: "#15bdff" },
	{ name: "Others", value: 10, color: "#b33fba" },
];

const FeaturesBarChart: React.FC = () => (
	<div className="w-full flex flex-col gap-4 sm:gap-[29px]">
		{data.map(item => (
			<div className="flex flex-col gap-3 sm:gap-5" key={item.name}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<span className="text-text dark:text-textDark text-xs sm:text-base">{item.name}</span>
					<span className="text-text dark:text-textDark text-sm sm:text-lg">{item.value}%</span>
				</div>
				<div className="bg-fgc dark:bg-fgcDark rounded-[6px] h-1 sm:h-2 ">
					<div
						className="h-1 sm:h-2"
						style={{
							background: item.color,
							borderRadius: 6,
							width: `${item.value}%`,
							transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
						}}
					/>
				</div>
			</div>
		))}
	</div>
);

export default FeaturesBarChart;
