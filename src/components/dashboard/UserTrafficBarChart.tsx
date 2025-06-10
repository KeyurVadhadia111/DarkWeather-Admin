import useAppState from "components/utils/useAppState";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

function useIsDesktop() {
	const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);
	useEffect(() => {
		const handleResize = () => setIsDesktop(window.innerWidth >= 640);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	return isDesktop;
}

const data = [
	{ name: "Mon", value: 5000 },
	{ name: "Tue", value: 3000 },
	{ name: "Wed", value: 6000 },
	{ name: "Thu", value: 8000 },
	{ name: "Fri", value: 5000 },
	{ name: "Sat", value: 2000 },
	{ name: "Sun", value: 1000 },
];

const UserTrafficBarChart: React.FC = () => {
	const isDesktop = useIsDesktop();
	const isDark = useAppState(state => state.isDark);
	return (
		<ResponsiveContainer width="100%" height={isDesktop ? 330 : 165}>
			<BarChart
				data={data}
				margin={
					isDesktop ? { top: 20, right: 30, left: 20, bottom: 5 } : { top: 0, right: 0, left: 0, bottom: 0 }
				}>
				<CartesianGrid
					stroke="rgba(120, 120, 120, 0.2)"
					strokeWidth={isDesktop ? 1 : 0.5}
					vertical={false}
					horizontal={true}
				/>
				<XAxis
					dataKey="name"
					axisLine={false}
					tickLine={false}
					tick={{
						fontSize: isDesktop ? 12 : 8,
						fill: isDark ? "#bdbdbd" : "#333333",
					}}
				/>
				<YAxis
					axisLine={false}
					tickLine={false}
					width={isDesktop ? 40 : 37}
					tick={{
						fontSize: isDesktop ? 12 : 8,
						fill: "#bdbdbd",
					}}
					tickFormatter={value => `${value.toLocaleString()}`}
					domain={[0, 10000]}
					tickCount={6}
				/>
				<Bar dataKey="value" fill="#ffa500" radius={[4, 4, 0, 0]} barSize={isDesktop ? 36 : 16} />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default UserTrafficBarChart;
