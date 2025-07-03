import { useEffect, useRef, useState } from "react";
import { Button } from "components/utils/Button";
import { Checkbox } from "components/utils/checkbox";
import { Input } from "components/utils/Input";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import useAppState from "components/utils/useAppState";
import { toast } from "components/utils/toast";
import Icon from "components/utils/Icon";
import OtpInput from "components/common/otpInput";
import CountDown from "components/common/CountDown";

function Login() {
	const isDark = useAppState(state => state.isDark);
	const setIsDark = useAppState(state => state.setIsDark);
	const userDetails = useAppState(state => state.userDetails);
	const setUserDetails = useAppState(state => state.setUserDetails);

	const [activeRole, setActiveRole] = useState("Super Admin");
	const [step, setStep] = useState(1);
	const [countDownTimer, setCountDownTimer] = useState(Date.now() + 60000);
	const roles = ["Super Admin", "Analytics", "Support", "Operations", "Meteorologist"];
	const otpInputRef = useRef<HTMLInputElement>(null);
	const emailInputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	type ILoginFormData = {
		email: string;
		password: string;
		remember: boolean;
		otp: string;
	};

	const schema = yup.object({
		email: yup.string().email("Invalid email").required("Email is required"),
		password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
		remember: yup.boolean().default(false).required(),
		otp: yup
			.string()
			.default("")
			.when([], {
				is: () => step === 2,
				then: () => yup.string().required("OTP is required"),
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
	} = useForm<ILoginFormData>({
		resolver: yupResolver(schema),
		defaultValues: {
			email: "",
			password: "",
			remember: false,
			otp: "",
		},
	});

	useEffect(() => {
		setUserDetails(JSON.parse(localStorage.getItem("auth") || "{}"));
		if (localStorage.theme === "dark") {
			setThemeMode(true);
		}
		if (window.matchMedia("(prefers-color-scheme: dark)").matches && localStorage?.theme === undefined) {
			setThemeMode(true);
		}
	}, [setUserDetails]);

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

	useEffect(() => {
		if (step === 1 && emailInputRef.current) {
			emailInputRef.current.focus();
		}
		if (step === 2 && otpInputRef.current) {
			otpInputRef.current.focus();
		}
	}, [step]);

	const resendOtp = () => {
		setCountDownTimer(Date.now() + 60000);
		toast.success("OTP resent!");
	};

	const onSubmit = (data: ILoginFormData) => {
		if (step === 1) {
			setStep(2);
			setCountDownTimer(Date.now() + 60000);
			toast.success("OTP sent to your email!");
			return;
		}
		const userDetails = JSON.parse(JSON.stringify(data));
		userDetails._id = Math.floor(Math.random() * 10000000000).toString();
		userDetails.role = activeRole.replace(/\s/g, ""); // Remove all spaces between words
		localStorage.setItem("auth", JSON.stringify(userDetails));
		setUserDetails(userDetails);
		toast.success("Login successful!");
		reset();
		setStep(1);
		navigate("/dashboard");
	};

	return (
		<div className="relative flex items-center bg-bgc dark:bg-bgcDark">
			<div className="w-full flex flex-col items-center gap-20 justify-start sm:justify-around relative h-dvh sm:pt-[100px]">
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
					<div className="flex flex-col items-center gap-[30px] sm:gap-[52px] w-full">
						<div className="flex flex-col items-center gap-1.5 sm:gap-3">
							<h1 className="font-bold text-2xl sm:text-[58px] leading-[150%]  text-text dark:text-textDark">
								{step === 1 ? (
									<>
										Welcome <span className="text-primary">Back!</span>
									</>
								) : (
									"OTP"
								)}
							</h1>
							<p className="text-textSecondary dark:text-textDark leading-[150%] text-sm sm:text-xl text-center w-full sm:w-[550px]">
								{step === 1
									? "Please enter your credentials to continue"
									: "We have sent a verification code to your email ID. Please check."}
							</p>
						</div>
						{/* Role Selection */}
						<div className="flex flex-col gap-6 sm:gap-9 w-full">
							{/* Role Tabs */}
							{step === 1 ? (
								<div className="flex items-center dark:text-textDark dark:bg-fgcDark rounded-[6px] sm:rounded-xl overflow-x-auto shadow-[0_4px_35px_rgba(0,0,0,0.05)]">
									{roles.map(role => (
										<button
											key={role}
											type="button"
											onClick={() => setActiveRole(role)}
											className={`text-xs sm:text-base px-2 py-1.5 sm:px-5 sm:py-2.5 rounded-md transition whitespace-nowrap ${activeRole === role
													? "bg-primary text-text font-semibold rounded-[6px] sm:rounded-lg"
													: "text-text dark:text-textDark font-normal"
												}`}>
											{role}
										</button>
									))}
								</div>
							) : (
								""
							)}
							{/* Login Form */}
							<form
								className={`flex flex-col ${step === 1 ? "gap-3 sm:gap-4" : "gap-2 sm:gap-[52px]"} w-full`}
								onSubmit={handleSubmit(onSubmit)}>
								{step === 1 && (
									<>
										<Input
											placeholder="Email"
											className="rounded-[10px] sm:!rounded-lg border-0 !px-3 !py-3 sm:!py-[18px] sm:!px-4 !text-xs sm:!text-base leading-[150%]"
											{...register("email")}
											error={errors?.email?.message?.toString()}
										/>
										<Input
											type="password"
											placeholder="Password"
											className="rounded-[10px] sm:!rounded-lg border-0 !px-3 !py-3 sm:!py-[18px] sm:!px-4 !text-xs sm:!text-base leading-[150%]"
											{...register("password")}
											error={errors?.password?.message?.toString()}
										/>
										<div className="flex items-center justify-end mt-0 sm:mt-2">
											<Link
												to={"/forgot-password"}
												className="font-medium text-text dark:text-textDark text-sm sm:text-lg">
												Forgot Password?
											</Link>
										</div>
									</>
								)}
								{step === 2 && (
									<div className="flex flex-col gap-2">
										<OtpInput
											ref={otpInputRef}
											onOtpChange={(otp: string) => {
												setValue("otp", otp);
												trigger("otp");
											}}
										/>
										{errors?.otp && (
											<span className="text-red-500 text-sm pl-4 sm:ml-18">
												{errors.otp.message?.toString()}
											</span>
										)}
									</div>
								)}
								<Button
									type="submit"
									className={`w-full bg-primary hover:bg-primary/80 text-text font-bold rounded-lg !py-[10px] sm:!py-[17px] text-lg transition ${step === 1 ? "mt-2" : "mt-[30px] sm:mt-0"}`}>
									{step === 1 ? "Verify" : "Submit"}
								</Button>
								{step === 2 && (
									<div className="flex items-center justify-center gap-2 text-sm sm:text-base ">
										<span className="font-normal text-text dark:text-textDark text-center">
											Didn’t receive the email?
										</span>
										<button
											type="button"
											onClick={() => setValue("otp", "")}
											className="text-primary hover:underline font-medium">
											Click to resend
										</button>
									</div>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* Right Side (Image) */}
			<div className="w-full h-dvh hidden sm:flex items-center justify-center relative overflow-hidden">
				<div className="w-full h-dvh bg-no-repeat bg-position-[center_top] bg-[length:360%] sm:bg-[length:120%] bg-[url('/assets/images/bg/bg-login.png')]" />
				<div className="absolute bg-gradient-to-b from-bgc/0 to-bgc dark:from-bgcDark/70 dark:to-bgcDark w-full h-auto" />
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

export default Login;
