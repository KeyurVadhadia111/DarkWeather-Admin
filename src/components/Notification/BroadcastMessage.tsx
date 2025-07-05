import { Button } from "components/utils/Button";
import { Input } from "components/utils/Input";
import Select from "components/utils/Select";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface BroadcastFormValues {
	title: string;
	body: string;
	deliveryChannels: string[] | undefined;
	targetAudience: number;
}

const targetAudience = [
	{ id: 1, title: "All Users" },
	{ id: 2, title: "United States User" },
	{ id: 3, title: "Texas Users" },
	{ id: 4, title: "New York Users" },
]

const schema = yup.object({
	title: yup.string().required("Title is required"),
	body: yup.string().required("Body is required"),
	deliveryChannels: yup.array().of(yup.string()).min(1, "Select at least one channel"),
	targetAudience: yup
		.number()
		.nullable()
		.transform((value, originalValue) => {
			return originalValue === "" || isNaN(value) ? null : value;
		})
		.required("Target Audience is required"),
});

const BroadcastMessage = () => {

	const {
		handleSubmit,
		register,
		control,
		reset,
		formState: { errors },
	} = useForm<BroadcastFormValues>({
		defaultValues: {
			title: "",
			body: "",
			deliveryChannels: [],
			targetAudience: 0,
		},
		resolver: yupResolver(schema),
	});

	const audienceOptions = targetAudience.map(audience => ({
		value: audience.id,
		text: audience.title,
	}));

	const onSubmit = (data: any) => {
		console.log("Submitted Data:", data);
	};

	const deliveryOptions = ["Push Notification", "Email", "SMS"];


	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="flex flex-col w-full gap-4 p-4 relative bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				<span className="text-xl text-text dark:text-white font-medium">Broadcast Message</span>

				<div className="flex flex-col sm:gap-6 gap-4 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">
					{/* Title */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							Message Title
						</label>
						<Input
							{...register("title")}
							name="title"
							placeholder="Enter Title"
							className="bg-white !w-full"
							error={errors?.title?.message}
						/>
					</div>

					{/* Body */}
					<div className="flex flex-col gap-2 sm:gap-3">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							Message Body
						</label>
						<textarea
							{...register("body")}
							name="body"
							placeholder="Enter Here..."
							className="bg-white dark:bg-fgcDark flex w-full rounded-lg text-sm sm:text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-textSecondary dark:placeholder:text-textDark/50  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border border-transparent py-[10.3px] sm:py-[17.1px] px-4 sm:px-5 font-normal  text-text dark:text-textDark"
						/>
						{errors?.body && <span className="text-sm text-red-500">{errors.body.message}</span>}
					</div>

					{/* Delivery Channels */}
					<div className="flex flex-col md:flex-row justify-between gap-4 w-full">
						<div className="flex flex-col items-start gap-4 w-full">
							<span className="text-text dark:text-textDark font-medium">Delivery Channels</span>
							<div className="flex flex-col lg:flex-row gap-2.5 w-full">
								{["Push Notification", "Email", "SMS"].map(channel => (
									<label
										key={channel}
										className="relative flex items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer w-full"
									>
										<input
											type="checkbox"
											value={channel}
											{...register("deliveryChannels")}
											className="peer hidden"
											name="deliveryChannels"
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
							{errors.deliveryChannels && (
								<p className="text-sm text-red-500">{errors.deliveryChannels.message}</p>
							)}
						</div>

						{/* Select */}
						<div className="flex flex-col gap-2 sm:gap-3 w-full">
							<Controller
								name="targetAudience"
								control={control}
								render={({ field }) => (
									<Select
										name="targetAudience"
										label="Target Audience"
										items={audienceOptions}
										value={field.value ?? ""}
										onChange={field.onChange}
										className="dark:!bg-fgcDark !h-[42px] sm:!h-[56px] !border-textSecondary/20 !text-textSecondary !w-full pr-10"
									/>
								)}
							/>
							{errors.targetAudience && (
								<p className="text-sm text-red-500">{errors.targetAudience.message}</p>
							)}
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
			</div>
		</form>
	);

}

export default BroadcastMessage;
