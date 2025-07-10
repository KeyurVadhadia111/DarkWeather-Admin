import { Button } from "components/utils/Button";
import { Input } from "components/utils/Input";
import Select from "components/utils/Select";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface TimeSettingsForm {
	timeZone: string;
	timeFormat: string;
	dateFormat: string;
	useSystemDefault: boolean;
}

const schema = yup.object({
	timeZone: yup.string().required("Time Zone is required"),
	dateFormat: yup.string().required("Date Format is required"),
	timeFormat: yup.string().required("Time Format is required"),
	useSystemDefault: yup.boolean(),
});

const dateFormatOptions = [
	{ id: 1, title: "DD-MM-YYYY" },
	{ id: 2, title: "MM-DD-YYYY" },
	{ id: 3, title: "YYYY-MM-DD" },
];

const timeZoneOptions = [
	{ id: 1, title: "IST (Indian Standard Time)" },
	{ id: 2, title: "GMT (Greenwich Mean Time)" },
	{ id: 3, title: "PST (Pacific Standard Time)" },
];

type FormFields = yup.InferType<typeof schema>;


const TimeZone = () => {

	const {
		handleSubmit,
		register,
		control,
		trigger,
		reset,
		formState: { errors },
	} = useForm<TimeSettingsForm>({
		defaultValues: {
			timeZone: "",
			dateFormat: "",
			timeFormat: "",
			useSystemDefault: false,
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

					{/* Time-Zone */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<Select
							name="timeZone"
							label="Time-Zone"
							placeholder="Select Time-Zone"
							required
							register={register}
							trigger={trigger}
							error={errors?.timeZone?.message}
							items={timeZoneOptions.map((item: any) => ({ value: item.id, text: item.title }))}
							className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
						/>
					</div>

					{/* 12-hour Option */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							Time Format
						</label>
						<div className="flex items-center gap-3">
							<div className="bg-white w-[218px] max-w-[218px] h-[56px] flex items-center px-4 rounded-xl">
								<label className="flex items-center gap-[5px] w-fit leading-none cursor-pointer">
									<input
										type="radio"
										{...register("timeFormat")}
										value="12-hour"
										className="appearance-none relative w-5 h-5 border border-[#808080] rounded-full cursor-pointer
             checked:border-[#f0ab2e]
             checked:after:content-[''] checked:after:absolute checked:after:inset-0
             checked:after:w-3 checked:after:h-3 checked:after:m-auto checked:after:rounded-full
             checked:after:bg-[#ffa500]"
									/>
									12-hour
								</label>
							</div>

							{/* 24-hour Option */}
							<div className="bg-white w-[218px] max-w-[218px] h-[56px] flex items-center px-4 rounded-xl">
								<label className="flex items-center gap-[5px] w-fit leading-none cursor-pointer">
									<input
										type="radio"
										{...register("timeFormat")}
										value="24-hour"
										className="appearance-none relative w-5 h-5 border border-[#808080] rounded-full cursor-pointer
             checked:border-[#f0ab2e]
             checked:after:content-[''] checked:after:absolute checked:after:inset-0
             checked:after:w-3 checked:after:h-3 checked:after:m-auto checked:after:rounded-full
             checked:after:bg-[#ffa500]"
									/>
									24-hour
								</label>
							</div>
						</div>
					</div>

					{/* Date Format */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<Select
							name="dateFormat"
							label="Date Format"
							placeholder="Select Date Format."
							required
							register={register}
							trigger={trigger}
							error={errors?.dateFormat?.message}
							items={dateFormatOptions.map((item: any) => ({ value: item.id, text: item.title }))}
							className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
						/>
					</div>

					<Controller
						name="useSystemDefault"
						control={control}
						render={({ field }) => (
							<div className="relative flex sm:justify-start justify-between items-center gap-2 w-full">
								<label className="text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer">
									Use system default
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

export default TimeZone;
