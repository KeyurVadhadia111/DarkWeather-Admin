import { Button } from "components/utils/Button";
import { Input } from "components/utils/Input";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "components/utils/toast";
import { useEffect, useState } from "react";
import OtpInput from "components/common/otpInput";
import Icon from "components/utils/Icon";
import { useAppState } from "components/utils/useAppState";

interface IForgotPasswordFormData {
	email: string;
	otp: string;
	password: string;
	confirmPassword: string;
}

function ForgotPasswordPage() {
	const [{ isDark, userDetails }, setAppState] = useAppState();

	const [step, setStep] = useState(1);

	const schema = yup.object().shape({
		email: yup.string().email("Invalid email").required("Email is required"),
		otp: yup
			.string()
			.default("")
			.when([], {
				is: () => step === 2,
				then: () =>
					yup
						.string()
						.required("OTP is required")
						.matches(/^\d{6}$/, "Invalid OTP. Please enter 6 digits"),
				otherwise: () => yup.string().notRequired(),
			}),
		password: yup
			.string()
			.default("")
			.when([], {
				is: () => step === 3,
				then: () =>
					yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
				otherwise: () => yup.string().notRequired(),
			}),
		confirmPassword: yup
			.string()
			.default("")
			.when([], {
				is: () => step === 3,
				then: () =>
					yup
						.string()
						.required("Confirm password is required")
						.oneOf([yup.ref("password")], "Passwords must match"),
				otherwise: () => yup.string().notRequired(),
			}),
	});

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		trigger,
		formState: { errors },
	} = useForm<IForgotPasswordFormData>({
		resolver: yupResolver(schema),
		defaultValues: {
			email: "",
			otp: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = handleSubmit(data => {
		if (step === 1) {
			toast.success("OTP sent to your email!");
			setStep(2);
			return;
		}

		if (step === 2) {
			toast.success("OTP verified successfully!");
			setStep(3);
			return;
		}

		if (step === 3) {
			toast.success("Password reset successfully!");
			setStep(4);
			reset();
			return;
		}
	});

	useEffect(() => {
		setAppState({ userDetails: JSON.parse(localStorage.getItem("auth") || "{}") });
		// Check for dark mode preference
		if (localStorage.theme === "dark") {
			setThemeMode(true);
			setAppState({ isDark: true });
		}
		if (window.matchMedia("(prefers-color-scheme: dark)").matches && localStorage?.theme === undefined) {
			setThemeMode(true);
			setAppState({ isDark: true });
		}
		// eslint-disable-next-line
	}, []);

	const setThemeMode = (isDark: boolean) => {
		if (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			document.documentElement.classList.add("dark");
			isDark = true;
		}
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		setAppState({ isDark: isDark });
	};

	return (
		<div className="relative flex items-center bg-bgc dark:bg-bgcDark">
			<div className={`w-full flex flex-col items-center gap-20 justify-start sm:justify-around  relative h-dvh`}>
				{/* Header */}
				<div className="absolute top-[12px] sm:top-[50px] left-auto flex items-center justify-between px-6 w-full max-w-[820px]">
					<Link to={"/"}>
						<img
							className="w-auto h-8 sm:h-[60px] !cursor-pointer"
							alt="Dark Weather Logo"
							src={`/assets/images/logo-${!isDark ? "light" : "dark"}.svg`}
						/>
					</Link>
					{/* Dark Mode Toggle */}
					<div>
						<Button
							onClick={() => {
								localStorage.setItem("theme", !isDark ? "dark" : "light");
								setThemeMode(!isDark);
							}}
							variant="outline"
							className="!bg-fgc dark:!bg-fgcDark !px-4 !py-3 sm:!px-6 sm:!py-[15px] !border-transparent !text-xs sm:!text-base font-semibold flex items-center gap-2 sm:gap-4 ">
							{isDark ? "Light Mode" : "Dark Mode"}
							<Icon icon={`${isDark ? "sun" : "moon"}`} className="w-4 h-4 sm:w-6 sm:h-6" />
						</Button>
					</div>
				</div>
				{/* Left Side */}
				<div className="flex flex-col justify-center items-center p-6 pt-[88px] sm:p-0 w-full sm:w-[615px]">
					{step === 4 ? (
						<div className="text-center flex flex-col items-center gap-2 sm:gap-6 w-full">
							<div className="flex flex-col justify-center items-center gap-[30px] sm:gap-[52px]">
								<img
									src="/assets/images/successfully-icon.svg"
									alt=""
									className="w-[180px] sm:w-[327px] h-auto"
								/>
								<h1 className="text-2xl sm:text-[58px] font-bold text-text dark:text-textDark">
									Successfully
								</h1>
							</div>
							<p className="text-textSecondary dark:text-textDark text-xs sm:text-xl">
								Your password has been reset
							</p>
							<Link to="/login" className="w-full mt-3.5 sm:mt-7">
								<Button
									type="button"
									className="w-full !text-xs sm:!text-base !py-3 sm:!py-[17px]"
									size="lg">
									Go to Log in
								</Button>
							</Link>
						</div>
					) : (
						<>
							<div className="flex flex-col items-center gap-[30px] sm:gap-[58px] w-full">
								<div className="flex flex-col items-center gap-2 sm:gap-3">
									<h1 className="text-2xl sm:text-[58px] font-bold text-text dark:text-textDark">
										{step === 1 && "Forgot Password"}
										{step === 2 && "OTP"}
										{step === 3 && "New Password"}
									</h1>
									<p className="sm:w-[615px] text-textSecondary sm:tracking-[1px] dark:text-textDark text-xs sm:text-xl text-center">
										{step === 1 &&
											"Enter your email address and we'll send you instructions to reset your password."}
										{step === 2 &&
											"We have sent a verification code to your email ID. Please check."}
										{step === 3 && "Must be at least 8 characters."}
									</p>
								</div>

								<form onSubmit={onSubmit} className="space-y-[30px] sm:space-y-[58px] w-full">
									{step === 1 && (
										<Input
											placeholder="Email"
											className="!py-2.5 sm:!py-[19px]"
											{...register("email")}
											error={errors?.email?.message}
										/>
									)}

									{step === 2 && (
										<div className="space-y-4">
											<OtpInput
												onOtpChange={(otp: string) => {
													setValue("otp", otp);
													trigger("otp");
												}}
											/>
											{errors?.otp && (
												<p className="text-red-500 text-sm pl-4 sm:ml-18">
													{errors.otp.message}
												</p>
											)}
										</div>
									)}

									{step === 3 && (
										<div className="space-y-4 ">
											<Input
												type="password"
												className="!py-2.5 sm:!py-[19px]"
												placeholder="Password"
												{...register("password")}
												error={errors?.password?.message}
											/>
											<Input
												type="password"
												className="!py-2.5 sm:!py-[19px]"
												placeholder="Confirm Password"
												{...register("confirmPassword")}
												error={errors?.confirmPassword?.message}
											/>
										</div>
									)}

									<Button
										type="submit"
										className="w-full !text-xs sm:!text-base !py-3 sm:!py-[17px]"
										size="lg">
										Submit
									</Button>
								</form>
							</div>
							<div className="text-center mt-3 sm:mt-7">
								{step === 1 && (
									<Link
										to="/login"
										className="text-primary hover:underline font-medium text-sm sm:text-lg">
										Back
									</Link>
								)}
								{step === 2 && (
									<p className="text-textSecondary dark:text-textDark text-sm sm:text-lg">
										Didn’t receive the email?{" "}
										<button
											type="button"
											onClick={() => setValue("otp", "")}
											className="text-primary hover:underline font-medium">
											Click to resend
										</button>
									</p>
								)}
								{step === 3 && (
									<Link
										to="/login"
										className="text-primary hover:underline font-medium text-sm sm:text-lg">
										Back
									</Link>
								)}
							</div>
						</>
					)}
				</div>
			</div>
			{/* Right Side (Image) */}
			<div className="w-full h-dvh hidden sm:flex items-center justify-center relative overflow-hidden">
				<div
					className={`w-full h-dvh bg-no-repeat bg-position-[center_top] bg-[length:360%] sm:bg-[length:120%] bg-[url('/assets/images/bg/bg-login.png')]`}
				/>
				<div
					className={`absolute bg-gradient-to-b from-bgc/0 to-bgc dark:from-bgcDark/70 dark:to-bgcDark w-full h-auto`}
				/>
				<img
					src={`/assets/images/dashboard${!isDark ? "-light" : "-dark"}.png`}
					alt="dashboard"
					className="absolute top-[206px] left-[246px] w-[750px] h-auto shrink-0"
					style={{ transform: "rotate(-10.85deg)" }}
				/>
			</div>
		</div>
	);
}

export default ForgotPasswordPage;
