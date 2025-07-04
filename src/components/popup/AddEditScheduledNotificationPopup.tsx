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
import TimePicker from "components/common/TimePicker";

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
	messageTitle: string;
	notificationType: string;
	pushNotification: string;
	email: string;
	sms: string;
	targetAudience: string;
	scheduledDateTime: {
		date: string;
		time: string;
	};
	timezone: string;
	recurringNotification: string;
	status: Status;
}

const getSchema = (editIndex: number | null) =>
	yup
		.object({
			messageTitle: yup.string().required("Message Title is required"),
			notificationType: yup.string().required("Notification Type is required"),
			pushNotification: yup.string().required("Push Template is required"),
			email: yup.string().required("Email Template is required"),
			sms: yup.string().required("SMS Template is required"),
			targetAudience: yup.string().required("Target Audience is required"),
			scheduledDateTime: yup.object({
				date: yup.string().required("Scheduled Date is required"),
				time: yup.string().required("Scheduled Time is required"),
			}),
			timezone: yup.string().required("Timezone is required"),
			recurringNotification: yup.string().required("Recurring Notification is required"),
			status: yup.mixed<Status>().oneOf(statusOptions).required("Status is required"),
		})
		.required();


const AddEditScheduledNotificationPopup: React.FC<Props> = ({ isOpen, setIsOpen, list = [], setList, editIndex = null }) => {
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
				messageTitle: userData.messageTitle || "",
				notificationType: userData.notificationType || "",
				pushNotification: userData.pushNotification || "",
				email: userData.email || "",
				sms: userData.sms || "",
				targetAudience: userData.targetAudience || "",
				scheduledDateTime: {
					date: userData.scheduledDateTime?.date || "",
					time: userData.scheduledDateTime?.time || "",
				},
				timezone: userData.timezone || "",
				recurringNotification: userData.recurringNotification || "",
				status: userData.status || "Active",
			});
		}
	}, [editIndex, isOpen, list, reset]);


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
					{editIndex !== null ? "Edit Scheduled Notification" : "Add Scheduled Notification"}
				</Dialog.Title>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
						{/* Alert */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Message Title
							</label>
							<Input
								{...register("messageTitle")}
								placeholder="Enter Message Title"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.messageTitle?.message}
							/>
						</div>
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<Select
								name="notificationType"
								label="Notification Type"
								placeholder="Select Notification Type"
								required
								register={register}
								trigger={trigger}
								error={errors?.notificationType?.message}
								items={channelOptions.map(severity => ({ value: severity, text: severity }))}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>

						<div className="col-span-2 sm:col-span-2 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Channel(s)
							</label>
							<div className="flex sm:flex-row flex-col gap-1.5 sm:gap-[60px]">
								<label
									className="relative flex items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer w-full sm:w-[170px]"
								>
									<input
										type="checkbox"
										// {...register(`access.${key}` as Path<FormData>)}
										className="peer hidden"
									/>

									<span
										className="
																w-4 h-4 rounded-md border border-[#808080] dark:border-white
																flex items-center justify-center
																bg-transparent
																peer-checked:bg-[#FFA500] peer-checked:border-[#FFA500]
																relative
															"
									>
									</span>
									<svg
										className="
																	w-3 h-3 text-black
																	absolute left-0.5
																	opacity-0 peer-checked:opacity-100
																	transition-opacity duration-150 ease-in-out
																	pointer-events-none
																"
										fill="none"
										stroke="currentColor"
										strokeWidth="3"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
									</svg>
									Push Notification
								</label>
								<div className="w-full sm:w-[336px]">
									<Select
										name="pushNotification"
										placeholder="Select Template"
										required
										register={register}
										trigger={trigger}
										error={errors?.pushNotification?.message}
										items={statusOptions.map(status => ({ value: status, text: status }))}
										className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
									/>
								</div>
							</div>
							<div className="flex sm:flex-row flex-col gap-1.5 sm:gap-[60px]">
								<label
									className="relative flex items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer w-full sm:w-[170px]"
								>
									<input
										type="checkbox"
										// {...register(`access.${key}` as Path<FormData>)}
										className="peer hidden"
									/>

									<span
										className="
																w-4 h-4 rounded-md border border-[#808080] dark:border-white
																flex items-center justify-center
																bg-transparent
																peer-checked:bg-[#FFA500] peer-checked:border-[#FFA500]
																relative
															"
									>
									</span>
									<svg
										className="
																	w-3 h-3 text-black
																	absolute left-0.5
																	opacity-0 peer-checked:opacity-100
																	transition-opacity duration-150 ease-in-out
																	pointer-events-none
																"
										fill="none"
										stroke="currentColor"
										strokeWidth="3"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
									</svg>
									Email
								</label>
								<div className="w-full sm:w-[336px]">
									<Select
										name="email"
										placeholder="Select Template"
										required
										register={register}
										trigger={trigger}
										error={errors?.email?.message}
										items={statusOptions.map(status => ({ value: status, text: status }))}
										className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
									/>
								</div>
							</div>
							<div className="flex sm:flex-row flex-col gap-1.5 sm:gap-[60px]">
								<label
									className="relative flex items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer w-full sm:w-[170px]"
								>
									<input
										type="checkbox"
										// {...register(`access.${key}` as Path<FormData>)}
										className="peer hidden"
									/>

									<span
										className="
																w-4 h-4 rounded-md border border-[#808080] dark:border-white
																flex items-center justify-center
																bg-transparent
																peer-checked:bg-[#FFA500] peer-checked:border-[#FFA500]
																relative
															"
									>
									</span>
									<svg
										className="
																	w-3 h-3 text-black
																	absolute left-0.5
																	opacity-0 peer-checked:opacity-100
																	transition-opacity duration-150 ease-in-out
																	pointer-events-none
																"
										fill="none"
										stroke="currentColor"
										strokeWidth="3"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
									</svg>
									SMS
								</label>
								<div className="w-full sm:w-[336px]">
									<Select
										name="sms"
										placeholder="Select Template"
										required
										register={register}
										trigger={trigger}
										error={errors?.sms?.message}
										items={statusOptions.map(status => ({ value: status, text: status }))}
										className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
									/>
								</div>
							</div>
						</div>

						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<Select
								name="targetAudience"
								label="Target Audience"
								placeholder="Select Target Audience"
								required
								register={register}
								trigger={trigger}
								error={errors?.targetAudience?.message}
								items={statusOptions.map(status => ({ value: status, text: status }))}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>

						<div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
							<label className="text-xs sm:text-sm font-medium text-text dark:text-textDark">Scheduled Date & Time</label>
							<div className="flex gap-3">
								<input {...register("scheduledDateTime.date")} type="date" className="w-full sm:h-14 text-textSecondary border border-textSecondary/20 rounded-xl px-3 py-2" />
								<TimePicker
									name="scheduledDateTime.time"
									register={register}
									setValue={setValue}
									getValues={getValues}
								/>


							</div>
						</div>

						<div className="col-span-2 sm:col-span-2 flex flex-col gap-2 sm:gap-3">
							<Select
								name="timezone"
								label="Timezone"
								placeholder="Select Time Zone"
								required
								register={register}
								trigger={trigger}
								error={errors?.timezone?.message}
								items={statusOptions.map(status => ({ value: status, text: status }))}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>

						<div className="col-span-2 sm:col-span-2 flex flex-col gap-2 sm:gap-3">
							<Select
								name="recurringNotification"
								label="Recurring Notification"
								placeholder="Select Recurring Notification"
								required
								register={register}
								trigger={trigger}
								error={errors?.recurringNotification?.message}
								items={statusOptions.map(status => ({ value: status, text: status }))}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
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

export default AddEditScheduledNotificationPopup;
