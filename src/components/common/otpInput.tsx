import React, { useState, useRef, ChangeEvent, forwardRef } from "react";

interface OtpInputProps {
	onOtpChange: (otp: string) => void;
	disbaled?: boolean;
	className?: string;
	containerClass?: string;
}

const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(
	({ onOtpChange, disbaled, className = "", containerClass = "" }, ref) => {
		const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
		const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

		const handleInputChange = (index: number, value: string) => {
			if (+value >= 10 || value?.length > 1) {
				value = Math.abs(+value % 10).toString();
			}

			const newOtp = [...otp];
			newOtp[index] = value;

			setOtp(newOtp);

			const combinedOtp = newOtp.join("");
			onOtpChange(combinedOtp);

			if (index < 5 && value !== "") {
				inputRefs.current[index + 1]?.focus();
			}
		};

		const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
			const pastedData = e.clipboardData.getData("Text");
			if (pastedData.length === 6 && /^[0-9]{6}$/.test(pastedData)) {
				e.preventDefault();

				const newOtp = pastedData.split("");
				setOtp(newOtp);
				onOtpChange(pastedData);

				inputRefs.current[5]?.focus();
			}
		};

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
			if (e.key === "Backspace" && index > 0) {
				e.preventDefault();

				if (e.currentTarget.value) {
					handleInputChange(index, "");
					inputRefs.current[index]?.focus();
				} else {
					handleInputChange(index - 1, "");
					inputRefs.current[index - 1]?.focus();
				}
			}
		};

		return (
			<div className={`${containerClass} flex gap-4 phone:gap-3 justify-center otp-input`}>
				{otp.map((value, index) => (
					<input
						key={index}
						ref={
							index === 0
								? (ref as React.RefObject<HTMLInputElement>)
								: (el: HTMLInputElement | null) => {
										inputRefs.current[index] = el;
									}
						}
						type="number"
						maxLength={1}
						value={value}
						onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(index, e.target.value)}
						disabled={disbaled}
						onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
						onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => handlePaste(e, index)}
						placeholder="-"
						className={`OTPInput ${className} w-[36px] sm:w-[60px] h-[36px] sm:h-[60px] rounded-lg phone:w-10 placeholder:absolute placeholder:top-0 placeholder:left-1/2 placeholder:-translate-x-1/2 placeholder:translate-y-3/5 sm:placeholder:translate-y-6/6 focus:ring-0 text-center focus:outline-none appearance-none border-black/10 text-text dark:text-textDark font-medium focus:border-gray-400 bg-fgc dark:bg-fgcDark text-sm sm:text-base`}
						style={{
							WebkitAppearance: "none",
							MozAppearance: "textfield",
						}}
					/>
				))}
			</div>
		);
	},
);

export default OtpInput;
