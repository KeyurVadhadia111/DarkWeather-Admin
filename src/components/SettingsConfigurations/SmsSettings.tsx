import { Button } from "components/utils/Button";
import { Input } from "components/utils/Input";
import Select from "components/utils/Select";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

type SMSConfig = {
	twilioAccountSid: string;
	twilioAuthToken: string;
	senderPhoneNumber: string;
	smsEnabled: boolean;
};

const schema = yup.object({
	twilioAccountSid: yup.string().required("Account SID is required"),
	twilioAuthToken: yup.string().required("Auth Token is required"),
	senderPhoneNumber: yup
		.string()
		.required("Sender Phone Number is required")
		.matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
	smsEnabled: yup.boolean(),
});

const SmsSettings = () => {

	const {
		handleSubmit,
		register,
		control,
		reset,
		formState: { errors },
	} = useForm<SMSConfig>({
		defaultValues: {
			twilioAccountSid: "",
			twilioAuthToken: "",
			senderPhoneNumber: "",
			smsEnabled: false,
		},
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: any) => {
		console.log("Submitted SMTP Data:", data);
		toast.success("SMS Settings saved successfully!");
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="flex flex-col w-full gap-4 p-3 sm:p-4 relative bg-bgc dark:bg-fgcDark border border-border dark:border-borderDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				<span className="text-xl text-text dark:text-white font-medium">SMS Configuration</span>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">

					{/* Twilio Account SID */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							Twilio Account SID
						</label>
						<Input
							{...register("twilioAccountSid")}
							name="twilioAccountSid"
							placeholder="Enter Account SID"
							className="bg-white !w-full"
							error={errors?.twilioAccountSid?.message}
						/>
					</div>

					{/* Twilio Auth Token */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							Twilio Auth Token
						</label>
						<Input
							{...register("twilioAuthToken")}
							name="twilioAuthToken"
							type="password"
							placeholder="Enter Twilio Auth Token."
							className="bg-white !w-full"
							error={errors?.twilioAuthToken?.message}
						/>
					</div>

					{/* Sender Phone Number */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							Sender Phone Number
						</label>
						<Input
							{...register("senderPhoneNumber")}
							name="senderPhoneNumber"
							placeholder="Enter Sender Phone Number."
							className="bg-white !w-full"
							error={errors?.senderPhoneNumber?.message}
						/>
					</div>

					<Controller
						name="smsEnabled"
						control={control}
						render={({ field }) => (
							<div className="relative flex sm:justify-start justify-between items-center gap-2 w-full">
								<label className="text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer">
									SMS Enabled
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

export default SmsSettings;
