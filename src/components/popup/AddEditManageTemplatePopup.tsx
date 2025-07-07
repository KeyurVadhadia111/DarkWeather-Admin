import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm, Resolver } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "@headlessui/react";
import { Input } from "components/utils/Input";
import Modal from "components/layout/modal";
import Icon from "components/utils/Icon";
import { Button } from "components/utils/Button";
import { toast } from "components/utils/toast";
import Select from "components/utils/Select";
import useAppState from "components/utils/useAppState";
import { apiClient } from "api/client";

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	list?: any[];
	setList?: (val: any[]) => void;
	editIndex?: number | null;
};

const statusOptions = ["Active", "Inactive"] as const;
const channelOptions = ["Push", "SMS", "Email"] as const;

type Status = (typeof statusOptions)[number];

interface FormData {
	templateName: string;
	channel: string;
	triggerEvent: string;
	variablesUsed: string;
	fileName: string;
	recipients: string[];
	status: Status;
}

const getSchema = (editIndex: number | null) =>
	yup
		.object({
			templateName: yup.string().required("Template Name is required"),
			channel: yup.string().required("Channel To is required"),
			triggerEvent: yup.string().required("Trigger Event To is required"),
			variablesUsed: yup.string().required("Variables Used is required"),
			fileName: yup.string().required("File Used is required"),
			recipients: yup.array().of(yup.string()).min(1, "Select at least one Recipients"),
			status: yup.mixed<Status>().oneOf(statusOptions).required("Status is required"),
		})
		.required();


const AddEditManageTemplatePopup: React.FC<Props> = ({ isOpen, setIsOpen, list = [], setList, editIndex = null }) => {
	const isDark = useAppState(state => state.isDark);
	const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(null);
	const headerFileInputRef = useRef<HTMLInputElement | null>(null);

	const schema = getSchema(editIndex);
	const resolver: Resolver<FormData> = yupResolver(schema) as unknown as Resolver<FormData>;

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		reset,
		trigger,
		formState: { errors },
	} = useForm<FormData>({
		resolver
	});

	useEffect(() => {
		if (editIndex !== null && list[editIndex]) {
			const userData = list[editIndex];
			reset({
				templateName: userData.templateName || "",
				channel: userData.channel || "",
				triggerEvent: userData.triggerEvent || "",
				variablesUsed: userData.variablesUsed || "",
				fileName: userData.fileName || "",
				recipients: userData.recipients || "",
				status: userData.status || "Active",
			});
		}
	}, [editIndex, isOpen, list, reset]);

	const handleFileDivClick = () => {
		headerFileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.type.startsWith("image/")) {
			toast.error("Image files are not allowed. Please upload a document.");
			return;
		}

		setValue("fileName", file.name);
		setHeaderImagePreview(file.name);
		console.log("Uploaded File:", file);
	};




	const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
		console.log("data", data)
		const updatedList = [...list];
		if (editIndex !== null) {
			updatedList[editIndex] = data;
		} else {
			updatedList.push(data);
		}
		setList?.(updatedList);
		toast.success(`Weather alert ${editIndex !== null ? "updated" : "added"} successfully!`);
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
					{editIndex !== null ? "Edit Template" : "Add Template"}
				</Dialog.Title>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
						{/* Alert */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Template Name
							</label>
							<Input
								{...register("templateName")}
								placeholder="Enter Template Name"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.templateName?.message}
							/>
						</div>
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<Select
								name="channel"
								label="Channel"
								placeholder="Select Channel"
								required
								register={register}
								trigger={trigger}
								error={errors?.channel?.message}
								items={channelOptions.map(severity => ({ value: severity, text: severity }))}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Trigger Event
							</label>
							<Input
								{...register("triggerEvent")}
								placeholder="Enter Trigger Event"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.triggerEvent?.message}
							/>
						</div>
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<Select
								name="status"
								label="Status"
								placeholder="Select Status"
								required
								register={register}
								trigger={trigger}
								error={errors?.status?.message}
								items={statusOptions.map(status => ({ value: status, text: status }))}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>

						<div className={`relative ${editIndex ? "col-span-1 sm:col-span-1" : "col-span-2"} flex flex-col gap-2 sm:gap-3`}>
							<h2 className="text-lg font-medium text-text dark:text-textDark">File Attach</h2>

							{/* Clickable Upload Box */}
							<div
								className={`${editIndex ? "flex justify-between items-center h-14 p-4 rounded-xl border border-border dark:border-borderDark" : "h-[200px] border-2 border-dotted border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer transition"}`}
								onClick={handleFileDivClick}
							>
								{headerImagePreview ? (
									<>
										{editIndex ? (
											<>
												<div className="flex gap-2 items-center">
													<Icon icon="txt" className="w-6 h-6" />
													<p className="text-sm mt-2 text-center text-gray-500">{getValues("fileName")}</p>
												</div>
												<Icon icon="close-circle" className="w-5 h-5" /></>
										) : (
											<p className="text-sm mt-2 text-center text-gray-500">{getValues("fileName")}</p>
										)}
									</>
								) : (
									<>
										<Icon icon="Cloud" className="w-10 h-10 text-gray-500 mb-2" />
										<p className="text-sm text-gray-600 text-center">Drop file here or click to browse</p>
									</>
								)}
							</div>

							{errors.fileName && (
								<p className="text-red-500 text-xs">{errors.fileName.message}</p>
							)}

							{/* Hidden file input */}
							<input
								type="file"
								accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip"
								ref={headerFileInputRef}
								onChange={handleFileChange}
								className="hidden"
							/>
						</div>

						{/* Recipients */}

						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<span className="text-base text-text dark:text-white font-medium">Recipients</span>

							{/* Notifications */}
							<div className="flex flex-col md:flex-row justify-between gap-4 w-full">
								<div className="flex flex-col items-start gap-4 w-full">
									<div className="flex gap-2.5 sm:gap-8 w-1/2">
										{["Admins", "Users", "Both"].map((channel: any) => (
											<label
												key={channel}
												className="relative flex items-center gap-3 text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer"
											>
												<input
													type="checkbox"
													value={channel}
													{...register("recipients")}
													className="peer hidden"
													name="recipients"
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
									{errors.recipients && (
										<p className="text-sm text-red-500">{errors.recipients.message}</p>
									)}
								</div>
							</div>
						</div>


						{/* Due To */}
						<div className={` ${editIndex ? "col-span-2" : "col-span-2 sm:col-span-1"} flex flex-col gap-2 sm:gap-3`}>
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Variables Used
							</label>
							<Input
								{...register("variablesUsed")}
								placeholder="Enter Variables Used"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.variablesUsed?.message}
							/>
						</div>
					</div>

					{/* Action Buttons */}

					<div className="flex justify-end gap-4 mt-0 sm:mt-2">
						<Button
							type="button"
							className="text-sm sm:text-base w-full sm:w-[127px] px-6 !py-[10.3px] sm:!py-[15.1px] border border-text dark:border-bgc rounded-xl font-semibold text-text dark:text-textDark bg-transparent hover:!bg-transparent"
							onClick={() => setIsOpen(false)}>
							Cancel
						</Button>
						<Button
							type="submit"
							className="text-sm sm:text-base w-full sm:w-auto px-6 !py-[10.3px] sm:!py-[15.1px] bg-primary rounded-xl font-semibold text-text">
							{editIndex === null ? "Add Weather Alert" : "save"}
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default AddEditManageTemplatePopup;
