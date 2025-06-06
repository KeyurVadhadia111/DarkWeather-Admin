import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CountDown: React.FC<{
	targetTime: any;
	onCountDownComplete: () => void;
}> = ({ targetTime, onCountDownComplete }) => {
	const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());

	useEffect(() => {
		const intervalId = setInterval(() => {
			const remainingTime = targetTime - Date.now();
			if (remainingTime <= 0) {
				clearInterval(intervalId);
				setTimeLeft(0);
			} else {
				setTimeLeft(remainingTime);
			}
		}, 1000);

		return () => clearInterval(intervalId); // Cleanup interval
	}, [targetTime]);

	const minutes = Math.max(0, Math.floor(timeLeft / 1000 / 60));
	const seconds = Math.max(0, Math.floor((timeLeft / 1000) % 60));

	return (
		<div>
			{timeLeft ? (
				<div className="text-textSecondary">
					Resend in {minutes < 10 ? `0${minutes}` : minutes}:
					{seconds < 10 ? `0${seconds}` : seconds}
				</div>
			) : (
				<Link
					to={"#"}
					type={"button"}
					onClick={() => {
						onCountDownComplete();
					}}
					className={"h-auto font-medium !text-primary"}
				// varient="outline"
				>
					{"Click to resend"}
				</Link>
			)}
		</div>
	);
};

export default CountDown;
