import { Button } from "components/utils/Button";
import { Input } from "components/utils/Input";
import Select from "components/utils/Select";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface SlackType {
	slackBotToken: string;
	signingSecret: string;
	slackWorkspaceURL: string;
	notifications: string[];
	defaultNotificationChannel: string;
	mentionRoles: string;
	alertSeverity: string;
	sendDailySummaryReport: boolean;
}
const schema = yup.object({
	slackBotToken: yup.string().required("Slack Bot Token is required"),
	signingSecret: yup.string().required("Signing Secret is required"),
	slackWorkspaceURL: yup.string().url("Enter a valid URL").required("Slack Workspace URL is required"),
	notifications: yup.array().of(yup.string()).min(1, "Select at least one notification"),
	defaultNotificationChannel: yup.string().required("Select a default notification channel"),
	mentionRoles: yup.string().required("Select a mention role"),
	alertSeverity: yup.string().required("Select alert severity"),
	sendDailySummaryReport: yup.boolean().required(),
});

export const defaultNotificationChannelOptions = [
	{ value: "general", text: "#general" },
	{ value: "dev-updates", text: "#dev-updates" },
	{ value: "alerts", text: "#alerts" },
	{ value: "random", text: "#random" },
];

export const mentionRolesOptions = [
	{ value: "admin", text: "@admin" },
	{ value: "dev_team", text: "@dev_team" },
	{ value: "qa_team", text: "@qa_team" },
	{ value: "support", text: "@support" },
];

export const alertSeverityOptions = [
	{ value: "info", text: "Info" },
	{ value: "warning", text: "Warning" },
	{ value: "critical", text: "Critical" },
];


const Slack = () => {

	const {
		handleSubmit,
		register,
		control,
		trigger,
		reset,
		formState: { errors },
	} = useForm<SlackType>({
		defaultValues: {
			slackBotToken: "",
			signingSecret: "",
			slackWorkspaceURL: "",
			notifications: [],
			defaultNotificationChannel: "",
			mentionRoles: "",
			alertSeverity: "",
			sendDailySummaryReport: false,
		},
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: any) => {
		console.log("Submitted Data:", data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="flex flex-col w-full gap-4 p-3 sm:p-4 relative bg-bgc dark:bg-fgcDark border border-border dark:border-borderDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				<span className="text-xl text-text dark:text-white font-medium">Slack Configuration</span>

				<div className="flex flex-col sm:gap-4 gap-3 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">
					<span className="text-base text-text dark:text-white font-medium">Slack App Credentials</span>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ">

						{/* Slack Bot Token */}
						<div className="flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Slack Bot Token
							</label>
							<Input
								{...register("slackBotToken")}
								name="slackBotToken"
								placeholder="Enter Slack Bot Token"
								className="bg-white !w-full"
								type="password"
								error={errors?.slackBotToken?.message}
							/>
						</div>

						{/* Signing Secret */}
						<div className="flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Signing Secret
							</label>
							<Input
								{...register("signingSecret")}
								name="signingSecret"
								type="password"
								placeholder="Enter Twilio Auth Token."
								className="bg-white !w-full"
								error={errors?.signingSecret?.message}
							/>
						</div>

						{/* Slack Workspace URL */}
						<div className="flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Slack Workspace URL
							</label>
							<Input
								{...register("slackWorkspaceURL")}
								name="slackWorkspaceURL"
								placeholder="Enter Sender Phone Number."
								className="bg-white !w-full"
								error={errors?.slackWorkspaceURL?.message}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col sm:gap-4 gap-3 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">
					<span className="text-base text-text dark:text-white font-medium">Event Triggers</span>

					{/* Notifications */}
					<div className="flex flex-col md:flex-row justify-between gap-4 w-full">
						<div className="flex flex-col items-start gap-4 w-full">
							<div className="flex flex-col lg:flex-row gap-2.5 sm:gap-8 w-full">
								{["New User Signup", "Payment Received", "Alert Created"].map(channel => (
									<label
										key={channel}
										className="relative flex items-center gap-3 text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer"
									>
										<input
											type="checkbox"
											value={channel}
											{...register("notifications")}
											className="peer hidden"
											name="notifications"
										/>
										<span className="w-4 h-4 rounded-md border border-[#808080] dark:border-white flex items-center justify-center bg-transparent peer-checked:bg-[#FFA500] peer-checked:border-[#FFA500] relative" />
										<svg
											className="w-3 h-3 text-black absolute left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity duration-150 ease-in-out pointer-events-none"
											fill="none"
											stroke="currentColor"
											strokeWidth="3"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
										</svg>
										{channel}
									</label>
								))}
							</div>
							{errors.notifications && (
								<p className="text-sm text-red-500">{errors.notifications.message}</p>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col sm:gap-4 gap-3 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">
					<span className="text-base text-text dark:text-white font-medium">Notification Settings</span>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark">

						{/* Default Notification Channel */}
						<div className="flex flex-col gap-2 sm:gap-3">
							<Select
								name="defaultNotificationChannel"
								label="Default Notification Channel"
								placeholder="Select Default Notification Channel"
								required
								register={register}
								trigger={trigger}
								error={errors?.defaultNotificationChannel?.message}
								items={defaultNotificationChannelOptions}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>

						{/* Mention Roles */}
						<div className="flex flex-col gap-2 sm:gap-3">
							<Select
								name="mentionRoles"
								label="Mention Roles"
								placeholder="Select Mention Roles."
								required
								register={register}
								trigger={trigger}
								error={errors?.mentionRoles?.message}
								items={mentionRolesOptions}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>

						{/* Alert Severity */}
						<div className="flex flex-col gap-2 sm:gap-3">
							<Select
								name="alertSeverity"
								label="Alert Severity"
								placeholder="Select Alert Severity."
								required
								register={register}
								trigger={trigger}
								error={errors?.alertSeverity?.message}
								items={alertSeverityOptions}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>

						<Controller
							name="sendDailySummaryReport"
							control={control}
							render={({ field }) => (
								<div className="relative flex sm:justify-start justify-between items-center gap-2 w-full">
									<label className="text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer">
										Send Daily Summary Report
									</label>
									<div>
										<div
											onClick={() => field.onChange(!field.value)}
											className={`w-[26px] h-[16px] rounded-full flex items-center px-0.5 transition-all duration-300 cursor-pointer ${field.value ? "bg-[#FFA500]" : "bg-[#808080]"
												}`}
										>
											<div
												className={`w-[14px] h-[14px] rounded-full transition-all duration-300 transform ${field.value ? "translate-x-[9px] bg-white" : "translate-x-[-1px] bg-[#F8F8F8]"
													}`}
											/>
										</div>
									</div>
								</div>
							)}
						/>


					</div>

				</div>
			</div>
			{/* Buttons */}
			<div className="flex justify-end gap-3">
				<Button
					type="button"
					className="text-sm sm:text-base w-auto px-6 !py-[10.3px] sm:!py-[15.1px] border border-text dark:border-bgc rounded-xl font-semibold text-text dark:text-textDark bg-transparent hover:!bg-transparent"
					onClick={() => reset()}
				>
					Reset
				</Button>
				<Button
					type="submit"
					className="text-sm sm:text-base w-auto px-6 !py-[10.3px] sm:!py-[15.1px] bg-primary rounded-xl font-semibold text-text"
				>
					Save
				</Button>
			</div>
		</form>
	);

}

export default Slack;
