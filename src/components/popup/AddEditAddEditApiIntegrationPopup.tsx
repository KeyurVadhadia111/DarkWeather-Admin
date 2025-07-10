import React, { useEffect } from "react";
import { SubmitHandler, useForm, Resolver, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "@headlessui/react";
import { Input } from "components/utils/Input";
import Modal from "components/layout/modal";
import { Button } from "components/utils/Button";
import { toast } from "components/utils/toast";
import Select from "components/utils/Select";

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	list?: any[];
	setList?: (val: any[]) => void;
	editIndex?: number | null;
};

const retryPolicyOptions = [
	{ value: "1", text: "1 Retry" },
	{ value: "2", text: "2 Retries" },
	{ value: "3", text: "3 Retries" },
	{ value: "5", text: "5 Retries" },
];

const timeoutMsOptions = [
	{ value: "100", text: "100 ms" },
	{ value: "250", text: "250 ms" },
	{ value: "500", text: "500 ms" },
	{ value: "1000", text: "1000 ms" },
	{ value: "2000", text: "2000 ms" },
];


interface FormData {
	provider: string;
	baseURL: string;
	apiKey: string;
	retryPolicy: string;
	fallbackProvider: string;
	timeoutMs: number;
	environment: string;
	status: string;
	enableIntegration?: boolean;
}

const getSchema = (editIndex: number | null) =>
	yup
		.object({
			provider: yup.string().required("Provider is required"),
			apiKey: yup.string().required("API Key is required"),
			baseURL: yup.string().url("Enter a valid URL").required("Base URL is required"),
			retryPolicy: yup.string().required("Retry Policy is required"),
			fallbackProvider: yup.string().required("Fallback Provider is required"),
			timeoutMs: yup
				.number()
				.typeError("Timeout must be a number")
				.min(100, "Minimum 100ms")
				.required("Timeout is required"),
			environment: yup.string().required("Environment is required"),
			status: yup.string().oneOf(["Enable", "Disable"]).required("Status is required"),
		})
		.required();


const AddEditAddEditApiIntegrationPopup: React.FC<Props> = ({ isOpen, setIsOpen, list = [], setList, editIndex = null }) => {

	const schema = getSchema(editIndex);
	const resolver: Resolver<FormData> = yupResolver(schema) as unknown as Resolver<FormData>;

	const {
		register,
		handleSubmit,
		reset,
		control,
		trigger,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			status: "Disable",
			enableIntegration: false,
		},
		resolver
	});

	useEffect(() => {
		if (editIndex !== null && list[editIndex]) {
			const userData = list[editIndex];
			reset({
				provider: userData.provider || "",
				apiKey: userData.apiKey || "",
				baseURL: userData.baseURL || "",
				retryPolicy: userData.retryPolicy || "",
				fallbackProvider: userData.fallbackProvider || "",
				timeoutMs: userData.timeoutMs || 1000,
				environment: userData.environment || "",
				status: userData.status || "Disable",
				enableIntegration: userData.status === "Enable",
			});
		}
	}, [editIndex, isOpen, list, reset]);



	const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
		const formattedData = {
			...data,
			status: data.enableIntegration ? "Enable" : "Disable",
		};

		const updatedList = [...list];
		if (editIndex !== null) {
			updatedList[editIndex] = formattedData;
		} else {
			updatedList.push(formattedData);
		}

		setList?.(updatedList);
		toast.success(`API Integration ${editIndex !== null ? "updated" : "added"} successfully!`);
		setIsOpen(false);
		reset();
	};



	return (
		<Modal
			openModal={isOpen}
			setOpenModal={() => {
				setIsOpen(false);
				reset();
			}}
			size="760">
			<div className="">
				<Dialog.Title className="text-base sm:text-2xl font-semibold text-text dark:text-textDark leading-[16px] sm:leading-[24px] mb-4 sm:mb-8">
					{editIndex !== null ? "Edit API Integration" : "Add API Integration"}
				</Dialog.Title>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

						{/* Provider */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Provider
							</label>
							<Input
								{...register("provider")}
								placeholder="Enter Provider"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.provider?.message}
							/>
						</div>

						{/* API Key */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Api key
							</label>
							<Input
								{...register("apiKey")}
								placeholder="Enter API Key"
								type="password"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.apiKey?.message}
							/>
						</div>

						{/* Base URL */}
						<div className="col-span-2 sm:col-span-2 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Base URL
							</label>
							<Input
								{...register("baseURL")}
								placeholder="Enter Base URL"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.baseURL?.message}
							/>
						</div>

						{/* Fallback Provider */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Fallback Provider
							</label>
							<Input
								{...register("fallbackProvider")}
								placeholder="Enter Fallback Provider"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.fallbackProvider?.message}
							/>
						</div>

						{/* Environment */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Environment
							</label>
							<Input
								{...register("environment")}
								placeholder="Enter Environment"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.environment?.message}
							/>
						</div>

						{/* Retry Policy */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<Select
								name="retryPolicy"
								label="Retry Policy"
								placeholder="Select Retry Policy"
								required
								register={register}
								trigger={trigger}
								error={errors?.retryPolicy?.message}
								items={retryPolicyOptions}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>

						{/* Timeout MS */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<Select
								name="timeoutMs"
								label="Timeout MS"
								placeholder="Select Timeout MS"
								required
								register={register}
								trigger={trigger}
								error={errors?.timeoutMs?.message}
								items={timeoutMsOptions}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>
						{editIndex && (
							<Controller
								name="enableIntegration"
								control={control}
								render={({ field }) => (
									<div className="relative flex items-center gap-2 w-full">
										<label className="text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer">
											Enable This Integration
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
						)}
					</div>

					{/* Action Buttons */}

					<div className="flex sm:flex-row flex-col justify-end gap-4 mt-0 sm:mt-2">
						<Button
							type="button"
							className="text-sm sm:text-base w-full sm:w-[127px] px-6 !py-[10.3px] sm:!py-[15.1px] border border-text dark:border-bgc rounded-xl font-semibold text-text dark:text-textDark bg-transparent hover:!bg-transparent"
							onClick={() => {
								reset();
								setIsOpen(false)
							}}>
							Cancel
						</Button>
						<Button
							type="submit"
							className="text-sm sm:text-base w-full sm:w-auto px-6 !py-[10.3px] sm:!py-[15.1px] bg-primary rounded-xl font-semibold text-text">
							{editIndex === null ? "Add API Integration" : "Edit API Integration"}
						</Button>
					</div>
				</form>
			</div >
		</Modal >
	);
};

export default AddEditAddEditApiIntegrationPopup;
