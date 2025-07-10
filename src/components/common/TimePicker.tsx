import React, { useEffect, useRef, useState } from "react";
import { UseFormRegister, UseFormSetValue, UseFormGetValues } from "react-hook-form";
import Icon from "components/utils/Icon";

interface TimePickerProps {
	name: any;
	label?: string;
	register: UseFormRegister<any>;
	setValue: UseFormSetValue<any>;
	getValues: UseFormGetValues<any>;
	error?: string;
	disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
	name,
	label,
	register,
	setValue,
	error,
	disabled,
}) => {
	const [hour, setHour] = useState("00");
	const [minute, setMinute] = useState("00");
	const [period, setPeriod] = useState<"AM" | "PM">("AM");
	const [isOpen, setIsOpen] = useState(false);

	const [selectedFlags, setSelectedFlags] = useState({
		hour: false,
		minute: false,
		period: false,
	});

	const popoverRef = useRef<HTMLDivElement>(null);
	const selectedTime = `${hour}:${minute} ${period}`;

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
				setIsOpen(false);
				resetFlags();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const resetFlags = () => {
		setSelectedFlags({ hour: false, minute: false, period: false });
	};

	const updateAndCheck = (field: "hour" | "minute" | "period") => {
		setSelectedFlags((prev) => {
			const updated = { ...prev, [field]: true };
			const allSelected = Object.values(updated).every(Boolean);

			if (allSelected) {
				setValue(name as any, selectedTime, { shouldValidate: true });
				setTimeout(() => {
					setIsOpen(false);
					resetFlags();
				}, 150);
			}

			return updated;
		});
	};

	const renderWheel = (
		items: string[],
		selected: string,
		onSelect: (value: string) => void,
		field: "hour" | "minute" | "period"
	) => (
		<div className="h-[220px] w-[70px] overflow-y-scroll scrollbar-hide relative snap-y snap-mandatory text-center">
			{items.map((item) => (
				<div
					key={item}
					onClick={() => {
						onSelect(item);
						updateAndCheck(field);
					}}
					className={`py-2 text-base snap-start cursor-pointer transition-all duration-200 ${item === selected
						? "dark:text-white text-black font-semibold"
						: "text-gray-500 dark:text-textTurnery"
						}`}
				>
					{item}
				</div>
			))}
			<div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b to-transparent pointer-events-none" />
			<div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t to-transparent pointer-events-none" />
		</div>
	);

	return (
		<div className="relative inline-block w-full" ref={popoverRef}>
			{label && <label className="block mb-1 text-sm font-medium">{label}</label>}
			<input type="hidden" {...register(name)} name={name} defaultValue={selectedTime} disabled={disabled} />
			<button
				type="button"
				disabled={disabled}
				onClick={() => {
					setIsOpen(!isOpen);
					resetFlags();
				}}
				className="flex justify-between items-center w-full sm:h-14 px-4 py-2 border rounded-xl bg-white dark:bg-fgcDark text-text dark:text-textSecondary text-left border-border dark:border-borderDark"
			>
				{selectedTime}
				{!disabled && <Icon icon="clock" className="w-4 h-4 sm:w-5 sm:h-5" />}
			</button>

			{isOpen && (
				<div className="absolute z-50 mt-2 bg-white dark:bg-bgcDark border border-border dark:border-borderDark rounded-xl shadow-lg p-4 w-[180px]">
					<div className="flex justify-center items-center gap-2">
						{renderWheel(
							Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")),
							hour,
							setHour,
							"hour"
						)}
						<span className="text-white text-lg">:</span>
						{renderWheel(
							Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")),
							minute,
							setMinute,
							"minute"
						)}
						{renderWheel(["AM", "PM"], period, (val) => setPeriod(val as "AM" | "PM"), "period")}
					</div>
				</div>
			)}
			{error && (
				<p className="text-red-500 text-xs mt-1">{error}</p>
			)}
		</div>
	);
};

export default TimePicker;
