import { Button } from "components/utils/Button";
import { Input } from "components/utils/Input";
import Select from "components/utils/Select";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface SMTPType {
	smtpHost: string;
	smtpPort: string;
	encryptionType: string;
	senderEmailAddress: string;
	SMTPUsername: string;
	SMTPPassword: string;
}
const schema = yup.object({
	smtpHost: yup.string().required("SMTP Host is required"),
	smtpPort: yup.string().required("Port is required"),
	encryptionType: yup.string().required("Encryption Type is required"),
	senderEmailAddress: yup.string().required("Sender Email Address is required"),
	SMTPUsername: yup.string().required("SMTP Username is required"),
	SMTPPassword: yup.string().required("SMTP Password is required"),
});

const encryptionTypeOptions = [
	{ id: 1, title: 'SSL' },
	{ id: 2, title: 'TLS' },
	{ id: 3, title: 'AES' },
];

const senderEmailAddressOptions = [
	{ id: 1, title: 'noreply@yourdomain.com' },
	{ id: 2, title: 'admin@example.com' },
	{ id: 3, title: 'support@example.com' },
];

const SMTPUsernameOptions = [
	{ id: 1, title: 'no-reply' },
	{ id: 2, title: 'admin' },
	{ id: 3, title: 'support' },
];

const EmailSettings = () => {

	const {
		handleSubmit,
		register,
		control,
		trigger,
		reset,
		formState: { errors },
	} = useForm<SMTPType>({
		defaultValues: {
			smtpHost: "",
			smtpPort: "",
			encryptionType: "",
			senderEmailAddress: "",
			SMTPUsername: "",
			SMTPPassword: "",
		},
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: any) => {
		console.log("Submitted SMTP Data:", data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="flex flex-col w-full gap-4 p-3 sm:p-4 relative bg-bgc dark:bg-fgcDark border border-border dark:border-borderDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				<span className="text-xl text-text dark:text-white font-medium">Email Server Settings (SMTP)</span>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">

					{/* SMTP Host */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							SMTP Host
						</label>
						<Input
							{...register("smtpHost")}
							name="smtpHost"
							placeholder="Enter SMTP Host"
							className="bg-white !w-full"
							error={errors?.smtpHost?.message}
						/>
					</div>

					{/* Port */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							Port
						</label>
						<Input
							{...register("smtpPort")}
							name="smtpPort"
							placeholder="Enter Port"
							className="bg-white !w-full"
							error={errors?.smtpPort?.message}
						/>
					</div>

					{/* Encryption Type */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<Select
							name="encryptionType"
							label="Encryption Type"
							placeholder="Select Encryption Type"
							required
							register={register}
							trigger={trigger}
							error={errors?.encryptionType?.message}
							items={encryptionTypeOptions.map((item: any) => ({ value: item.id, text: item.title }))}
							className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
						/>
					</div>

					{/* Sender Email Address */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<Select
							name="senderEmailAddress"
							label="Sender Email Address"
							placeholder="Select Sender Email Address"
							required
							register={register}
							trigger={trigger}
							error={errors?.senderEmailAddress?.message}
							items={senderEmailAddressOptions.map((item: any) => ({ value: item.id, text: item.title }))}
							className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
						/>
					</div>

					{/* SMTP Username */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<Select
							name="SMTPUsername"
							label="SMTP Username"
							placeholder="Select SMTP Username"
							required
							register={register}
							trigger={trigger}
							error={errors?.SMTPUsername?.message}
							items={SMTPUsernameOptions.map((item: any) => ({ value: item.id, text: item.title }))}
							className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
						/>
					</div>

					{/* SMTP Password */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							SMTP Password
						</label>
						<Input
							{...register("SMTPPassword")}
							name="SMTPPassword"
							type="password"
							placeholder="Enter SMTP Password"
							className="bg-white !w-full"
							error={errors?.SMTPPassword?.message}
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

export default EmailSettings;
