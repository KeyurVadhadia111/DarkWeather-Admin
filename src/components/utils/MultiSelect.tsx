import { useState, useRef, useEffect } from "react";
import Icon from "./Icon";
import { cn } from "lib/utils";

interface Props {
	name: string;
	label?: string;
	required?: boolean;
	error?: string;
	className?: string;
	itemClassName?: string;
	items: { value: string; text: string }[];
	value?: string[];
	onChange?: (selected: string[]) => void;
}

const MultiSelect = ({
	name,
	label,
	required,
	error,
	className,
	itemClassName,
	items,
	value = [],
	onChange,
}: Props) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (val: string) => {
		let newValue: string[];
		if (value.includes(val)) {
			newValue = value.filter(v => v !== val); // Remove if already selected
		} else {
			newValue = [...value, val]; // Add if not selected
		}
		onChange && onChange(newValue);
		// Do not close dropdown on select for multi-select
	};

	return (
		<div className={`relative`} ref={ref}>
			{label && (
				<label className="text-xs sm:text-base font-medium text-text dark:text-textDark mb-2 block">
					{label} {required && <span className="text-red-500">*</span>}
				</label>
			)}
			<div
				className={cn(
					`border rounded-xl px-4 sm:px-5 py-2 bg-bgc dark:bg-fgcDark cursor-pointer flex items-center ${error ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`,
					className,
				)}
				onClick={() => setOpen(!open)}>
				<span
					className={cn(
						`flex-1 ${value.length === 0 ? "text-textSecondary" : "text-text dark:text-textDark"} `,
						itemClassName,
					)}>
					{value.length
						? items
								.filter(i => value.includes(i.value))
								.map(i => i.text)
								.join(", ")
						: `Select ${name}`}
				</span>
				<Icon
					icon="arrow-down"
					className={`w-4 h-4 sm:w-6 sm:h-6 text-textSecondary ml-1 ${open === true ? "rotate-180" : ""}`}
				/>
			</div>
			{open && (
				<div className="absolute z-50 mt-2 w-full bg-bgc dark:bg-fgcDark border border-textSecondary/20 rounded-xl p-2">
					{items.map(item => {
						const checked = value.includes(item.value);
						return (
							<label
								key={item.value}
								className="flex items-center gap-3 sm:gap-4 px-3 py-2 rounded-lg cursor-pointer hover:bg-fgc dark:hover:bg-bgcDark/50">
								<span className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center cursor-pointer">
									<input
										type="checkbox"
										checked={checked}
										onChange={() => handleSelect(item.value)}
										className="opacity-0 absolute w-4 h-4 sm:w-5 sm:h-5 cursor-pointer bg-transparent"
									/>
									<span
										className={`w-4 h-4 sm:w-[17px] sm:h-[17px] rounded-[2px] border border-textSecondary flex items-center justify-center transition-colors duration-150 ${
											checked ? "bg-primary !border-primary" : "bg-transparent"
										}`}>
										{checked && (
											<Icon
												icon="check"
												className="w-2.5 h-2.5 sm:w-3 sm:h-3 mt-[1px] ml-[1px] sm:ml-0.5"
											/>
										)}
									</span>
								</span>
								<span className="text-xs sm:text-base text-gray-900 dark:text-gray-100">
									{item.text}
								</span>
							</label>
						);
					})}
				</div>
			)}
			{error && (
				<span className="text-red-500 px-5 text-sm sm:text-base inline-block">
					{error && (
						<>
							<span>{error}</span>
						</>
					)}
					&nbsp;
				</span>
			)}
		</div>
	);
};

export default MultiSelect;
