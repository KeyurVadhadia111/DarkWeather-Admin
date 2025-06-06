import { Button } from "components/utils/Button";
import { Card, CardContent } from "components/utils/Card";
import { Input } from "components/utils/Input";
import { Separator } from "components/utils/Separator";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Icon from "components/utils/Icon";
import { useAppState } from "components/utils/useAppState";
import { toast } from "components/utils/toast";
import { useEffect, useState } from "react";
import OtpInput from "components/common/otpInput";
import CountDown from "components/common/CountDown";

function Register() {
	const [{ userDetails }, setAppState] = useAppState();
	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [countDownTimer, setCountDownTimer] = useState(Date.now() + 10);

	const weatherCards = [
		{
			id: 1,
			title: "40%",
			subtitle: "Humidity",
			image: "/assets/images/humidity.svg",
			position: "top-[180px] left-[140px]",
		},
		{
			id: 2,
			title: "Moderate",
			subtitle: "UV Index",
			image: "/assets/images/uv-index.svg",
			position: "top-[475px] left-[180px]",
		},
		{
			id: 3,
			title: "6 mph SW",
			subtitle: "Wind",
			image: "/assets/images/wind.svg",
			position: "top-[310px] left-[435px]",
		},
	];

	const registerSchema = yup.object({
		fullName: yup.string().required("Full name is required"),
		email: yup.string().email("Invalid email").required("Email is required"),
		password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref("password")], "Passwords must match")
			.required("Confirm password is required"),

		otp: yup
			.string()
			.optional()
			.when([], {
				is: () => step === 2,
				then: schema =>
					schema
						.required("OTP is required")
						.matches(/^\d{6}$/, "*Invalid OTP. Please re-enter to confirm.")
						.min(6, "OTP must be 6 digits")
						.max(6, "OTP must be 6 digits"),
				otherwise: schema => schema.optional(),
			}),
	});

	type IRegisterFormData = yup.InferType<typeof registerSchema>;

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		trigger,
		formState: { errors },
	} = useForm<any>({
		resolver: yupResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			// remember: false,
			otp: "",
		},
	});

	const onSubmit = (data: IRegisterFormData) => {
		if (step === 1) {
			setStep(2);
			return;
		}
		const userDetails = JSON.parse(JSON.stringify(data));
		userDetails._id = Math.floor(Math.random() * 10000000000).toString();
		localStorage.setItem("auth", JSON.stringify(userDetails));
		setAppState({ userDetails: userDetails });
		toast.success("Registration successful!");
		console.log("userDetails", userDetails);
		reset();
	};

	const resendOtp = async () => {
		setIsLoading(true);
		try {
			setIsLoading(false);
			setCountDownTimer(Date.now() + 60000);
		} catch (error: any) {
			toast.error(error?.response?.data?.error || error?.response?.data?.message || "Something went wrong.");
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="container grid sm:grid-cols-2 grid-cols-1 justify-between">
				{/* Left Side Image */}

				<div className="w-[789px] relative -ml-[164px] sm:block hidden">
					<img className="w-[789px]" alt="Person In Snow" src="/assets/images/snow-falling-bro.svg" />

					{/* Weather Information Cards */}
					{weatherCards.map(card => (
						<Card
							key={card.id}
							className={`absolute flex items-center gap-y-[30px] gap-x-2 !p-4 bg-bgc rounded-[20px] border-none shadow-[0px_20px_35px_#0000000d] ${card.position}`}>
							<CardContent className="flex items-center gap-6 !p-0 !w-max">
								<img className="w-14 h-14" alt={card.subtitle} src={card.image} />
								<div className="flex flex-col gap-1">
									<h3 className="font-semibold text-text dark:text-textDark text-2xl leading-6">
										{card.title}
									</h3>
									<p className="font-normal text-textSecondary dark:text-textDark text-base tracking-[0.80px] leading-6">
										{card.subtitle}
									</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Login Card */}
				<div className="w-full max-w-[570px] sm:mt-[54px] mt-6 relative justify-self-end">
					<img
						className="sm:w-[122px] sm:h-[122px] w-[60px] h-[60px] mx-auto mb-4 absolute left-1/2 transform -translate-x-1/2 sm:-top-[38px] z-0 -top-6"
						alt="Weather icon"
						src="/assets/images/sunny.svg"
					/>

					<Card className="w-full bg-bgc rounded-[20px] relative z-0">
						<CardContent className="sm:!p-8 flex flex-col sm:gap-6 gap-6 !p-4">
							{/* Login Form */}
							<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:gap-6 gap-6">
								{step === 1 ? (
									<>
										{/* Card Header */}
										<div className="text-center">
											<h1 className="font-bold sm:text-5xl sm:leading-[72px] text-2xl mb-2.5">
												<span className="text-text dark:text-textDark">Create </span>
												<span className="text-primary">Account</span>
											</h1>
											<p className="font-normal text-textSecondary dark:text-textDark sm:text-base text-xs tracking-[0.80px] leading-6">
												Please Enter Your Details to Create Account.
											</p>
										</div>

										<div className="flex flex-col sm:gap-5 gap-5">
											<Input
												placeholder="Full Name"
												{...register("fullName")}
												error={errors?.fullName?.message?.toString()}
											/>

											<Input
												placeholder="Email"
												{...register("email")}
												error={errors?.email?.message?.toString()}
											/>

											<Input
												type="password"
												placeholder="Password"
												{...register("password")}
												error={errors?.password?.message?.toString()}
											/>

											<Input
												type="password"
												placeholder="Confirm Password"
												{...register("confirmPassword")}
												error={errors?.confirmPassword?.message?.toString()}
											/>
										</div>

										{/* Login Button */}
										<Button type="submit" className="!px-8">
											Register
										</Button>

										{/* Or Divider */}
										<div className="flex items-center justify-center gap-2">
											<Separator className="!w-[50px] " />
											<span className="font-medium text-textSecondary dark:text-textDark text-sm text-center leading-[21px]">
												Or Register With
											</span>
											<Separator className="!w-[50px] !bg-gradient-to-r" />
										</div>

										{/* Social Login Options */}
										<div className="flex items-start sm:gap-6 gap-4">
											<Button
												variant="none"
												className="flex-1 justify-center sm:gap-4 px-4 bg-fgc dark:bg-fgcDark rounded-xl border-0 hover:bg-neutral-100 dark:hover:bg-neutral-700 gap-2 py-6 sm:py-4 ">
												<img className="w-6 sm:w-auto" src="/assets/images/google-logo.svg" />
												<span className="font-semibold text-textTurnery dark:text-textDark text-base text-center leading-6">
													Google
												</span>
											</Button>
											<Button
												variant="none"
												className="flex-1 justify-center sm:gap-4 px-4 bg-fgc dark:bg-fgcDark rounded-xl border-0 hover:bg-neutral-100 dark:hover:bg-neutral-700 gap-2 py-6 sm:py-4">
												<Icon
													className="w-6 h-6 sm:w-8 sm:h-8 text-text dark:text-textDark"
													icon="apple-logo"
												/>
												<span className="font-semibold text-textTurnery dark:text-textDark text-base text-center">
													Apple
												</span>
											</Button>
										</div>
									</>
								) : (
									<>
										{/* Card Header */}
										<div className="text-center flex flex-col items-center ">
											<h1 className="font-bold sm:text-5xl sm:leading-[72px] text-2xl mb-2.5">
												<span className="text-text dark:text-textDark">OTP</span>
											</h1>
											<p className="font-normal text-textSecondary dark:text-textDark sm:text-base text-xs tracking-[0.80px] leading-6 w-2/3">
												We have sent a verification code to your email ID. Please check.
											</p>
										</div>
										<div>
											<OtpInput
												onOtpChange={(otp: string) => {
													setValue("otp", otp);
													trigger("otp");
												}}
												disbaled={isLoading}
											/>

											<div className="text-sm !text-red-500 px-5 sm:px-9 mt-1">
												{errors?.otp?.message?.toString()}
											</div>
										</div>

										{/* Login Button */}
										<Button type="submit" className="!px-8">
											Submit
										</Button>

										{/* Resend Link */}
										<div className="flex items-center justify-center gap-2 text-sm sm:text-base">
											<span className="font-normal text-text dark:text-textDark text-center">
												Didn’t receive the email?
											</span>
											<CountDown
												targetTime={countDownTimer}
												onCountDownComplete={() => {
													resendOtp();
												}}
											/>
										</div>
									</>
								)}
							</form>

							{/* Register Link */}
							<div className="flex items-center justify-center gap-2 text-sm sm:text-base">
								<span className="font-normal text-text dark:text-textDark text-center">
									Already Have an Account?
								</span>
								<Link to={"/login"} className="h-auto font-medium !text-primary">
									Log In
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}

export default Register;
