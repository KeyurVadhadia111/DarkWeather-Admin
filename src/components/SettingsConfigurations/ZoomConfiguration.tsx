import { Button } from "components/utils/Button";
import { Input } from "components/utils/Input";
import Select from "components/utils/Select";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface FormData {
	zoomAccountId: string;
	zoomClientId: string;
	zoomClientSecretKey: string;
	accountLinking: "connected" | "not-connected";
}

const schema = yup.object({
	zoomAccountId: yup.string().required("Zoom Account ID is required"),
	zoomClientId: yup.string().required("Zoom Client ID is required"),
	zoomClientSecretKey: yup.string().required("Zoom Client Secret Key is required"),
	accountLinking: yup
		.mixed<"connected" | "not-connected">()
		.oneOf(["connected", "not-connected"])
		.required("Account linking selection is required"),
});


const ZoomConfiguration = () => {

	const {
		handleSubmit,
		register,
		control,
		trigger,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			zoomAccountId: "",
			zoomClientId: "",
			zoomClientSecretKey: "",
			accountLinking: "connected",
		},
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: any) => {
		console.log("Submitted Data:", data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="flex flex-col w-full gap-4 p-3 sm:p-4 relative bg-bgc dark:bg-fgcDark border border-border dark:border-borderDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				<span className="text-xl text-text dark:text-white font-medium">Zoom Configuration</span>

				<div className="flex flex-col sm:gap-4 gap-3 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ">

						{/* Zoom Account ID */}
						<div className="flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Zoom Account ID
							</label>
							<Input
								{...register("zoomAccountId")}
								name="zoomAccountId"
								placeholder="Enter Zoom Account ID"
								className="bg-white !w-full"
								type="text"
								error={errors?.zoomAccountId?.message}
							/>
						</div>

						{/* Zoom Client ID */}
						<div className="flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Zoom Client ID
							</label>
							<Input
								{...register("zoomClientId")}
								name="zoomClientId"
								type="text"
								placeholder="Enter Twilio Auth Token."
								className="bg-white !w-full"
								error={errors?.zoomClientId?.message}
							/>
						</div>

						{/* Zoom Client Secret Key */}
						<div className="flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Zoom Client Secret Key
							</label>
							<Input
								{...register("zoomClientSecretKey")}
								name="zoomClientSecretKey"
								placeholder="Enter Sender Phone Number."
								className="bg-white !w-full"
								type="password"
								error={errors?.zoomClientSecretKey?.message}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col sm:gap-4 gap-3 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ">

						{/* Zoom Account ID */}
						<div className="col-span-3 lg:col-span-3 flex flex-col gap-2 sm:gap-3 w-full">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Account Linking
							</label>
							<div className="flex lg:flex-row flex-col items-center gap-3 w-full">
								<div className="bg-white dark:bg-fgcDark w-full h-[56px] flex items-center px-4 rounded-xl">
									<label className="flex items-center gap-[5px] w-fit leading-none cursor-pointer text-sm text-text dark:text-textDark">
										<input
											type="radio"
											{...register("accountLinking")}
											value="connected"
											className="appearance-none relative w-5 h-5 border border-[#808080] rounded-full cursor-pointer
             checked:border-[#f0ab2e]
             checked:after:content-[''] checked:after:absolute checked:after:inset-0
             checked:after:w-3 checked:after:h-3 checked:after:m-auto checked:after:rounded-full
             checked:after:bg-[#ffa500]"
										/>
										Connect Zoom Account
									</label>
								</div>

								{/* 24-hour Option */}
								<div className="bg-white dark:bg-fgcDark w-full h-[56px] flex items-center px-4 rounded-xl">
									<label className="flex items-center gap-[5px] w-fit leading-none cursor-pointer text-sm text-text dark:text-textDark">
										<input
											type="radio"
											{...register("accountLinking")}
											value="not-connected"
											className="appearance-none relative w-5 h-5 border border-[#808080] rounded-full cursor-pointer
             checked:border-[#f0ab2e]
             checked:after:content-[''] checked:after:absolute checked:after:inset-0
             checked:after:w-3 checked:after:h-3 checked:after:m-auto checked:after:rounded-full
             checked:after:bg-[#ffa500]"
										/>
										No account connected
									</label>
								</div>
							</div>
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

export default ZoomConfiguration;
