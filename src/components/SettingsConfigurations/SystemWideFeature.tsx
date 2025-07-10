import { Button } from "components/utils/Button";
import { Input } from "components/utils/Input";
import Select from "components/utils/Select";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface SettingsConfigurationsType {
	maintenanceMode: boolean;
	displayMessage: string;
	notifications: string[];
}
const schema = yup.object({
	maintenanceMode: yup.boolean().required(),
	displayMessage: yup.string().required("Display Message is required"),
	notifications: yup.array().of(yup.string()).min(1, "Select at least one notifications"),
});

const SystemWideFeature = () => {

	const {
		handleSubmit,
		register,
		control,
		reset,
		formState: { errors },
	} = useForm<SettingsConfigurationsType>({
		defaultValues: {
			maintenanceMode: false,
			displayMessage: "",
			notifications: [],
		},
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: any) => {
		console.log("Submitted Data:", data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="flex flex-col w-full gap-4 p-3 sm:p-4 relative bg-bgc dark:bg-fgcDark border border-border dark:border-borderDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				<span className="text-xl text-text dark:text-white font-medium">System-Wide Feature</span>

				<div className="flex flex-col sm:gap-4 gap-3 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">
					<Controller
						name="maintenanceMode"
						control={control}
						render={({ field }) => (
							<div className="relative flex items-center gap-2 w-full">
								<label className="text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer">
									Globally disable user access (except admins)
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


					{/* Display a message */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							Display a message
						</label>
						<Input
							{...register("displayMessage")}
							name="displayMessage"
							placeholder="Enter Title"
							className="bg-white !w-full"
							error={errors?.displayMessage?.message}
						/>
					</div>
				</div>

				<div className="flex flex-col sm:gap-4 gap-3 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">
					<span className="text-base text-text dark:text-white font-medium">Notifications</span>

					{/* Notifications */}
					<div className="flex flex-col md:flex-row justify-between gap-4 w-full">
						<div className="flex flex-col items-start gap-4 w-full">
							<div className="flex flex-col lg:flex-row gap-2.5 sm:gap-8 w-1/2">
								{["in-app push", "Email", "SMS"].map(channel => (
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

export default SystemWideFeature;
