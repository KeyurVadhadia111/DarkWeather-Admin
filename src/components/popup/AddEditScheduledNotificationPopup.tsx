import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm, Resolver } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "@headlessui/react";
import { Input } from "components/utils/Input";
import Modal from "components/layout/modal";
import { Button } from "components/utils/Button";
import { toast } from "components/utils/toast";
import Select from "components/utils/Select";
import useAppState from "components/utils/useAppState";
import TimePicker from "components/common/TimePicker";
import { format } from 'date-fns';
type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	list?: any[];
	setList?: (val: any[]) => void;
	editIndex?: number | null;
};

const statusOptions = ["Active", "Inactive"] as const;
const notificationTypeOptions = [
	{ id: 1, title: "Announcement" },
	{ id: 2, title: "Reminder" },
	{ id: 3, title: "Alert" },
	{ id: 4, title: "Promotion" },
	{ id: 5, title: "Update" },
	{ id: 7, title: "Event" },
] as const;


const timezoneOptions = [
	{ id: 1, title: "UTC" },
	{ id: 2, title: "America/New_York (EST)" },
	{ id: 3, title: "Europe/London (GMT)" },
	{ id: 4, title: "Asia/Kolkata (IST)" },
] as const;

const recurringNotificationOptions = [
	{ id: 1, title: "None" },
	{ id: 2, title: "Daily" },
	{ id: 3, title: "Weekly" },
	{ id: 4, title: "Biweekly" },
	{ id: 5, title: "Monthly" },
	{ id: 6, title: "Quarterly" },
	{ id: 7, title: "Yearly" }
] as const;

const pushNotificationTemplateOptions = [
	{ id: 1, title: "Welcome Push" },
	{ id: 2, title: "Daily Reminder Push" },
	{ id: 3, title: "Event Alert Push" },
	{ id: 4, title: "Promotion Push" },
	{ id: 5, title: "Custom Push Template" }
] as const;

const emailTemplateOptions = [
	{ id: 1, title: "Welcome Email" },
	{ id: 2, title: "Verification Email" },
	{ id: 3, title: "Newsletter Email" },
	{ id: 4, title: "Promotion Email" },
	{ id: 5, title: "Password Reset Email" }
] as const;

const smsTemplateOptions = [
	{ id: 1, title: "OTP SMS" },
	{ id: 2, title: "Event Reminder SMS" },
	{ id: 3, title: "Promotional SMS" },
	{ id: 4, title: "Support Follow-up SMS" },
	{ id: 5, title: "Feedback Request SMS" }
] as const;

const targetAudienceOptions = [
	{ id: 1, title: "All Users" },
	{ id: 2, title: "United States User" },
	{ id: 3, title: "Texas Users" },
	{ id: 4, title: "New York Users" },
] as const;



type Status = (typeof statusOptions)[number];

interface FormData {
	messageTitle: string;
	notificationType: string;
	channel: string[];
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
	status?: Status;
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
		defaultValues: { channel: [] },
		resolver
	});

	useEffect(() => {
		if (editIndex !== null && list[editIndex]) {
			const userData = list[editIndex];
			console.log("Editing item:", userData);
			const selectedChannels = Array.isArray(userData.channel) ? userData.channel : [];

			reset({
				messageTitle: userData.messageTitle || "",
				notificationType: userData.notificationType || "",
				channel: selectedChannels,
				pushNotification: selectedChannels.includes("Push") ? userData.pushNotification || "" : "",
				email: selectedChannels.includes("Email") ? userData.email || "" : "",
				sms: selectedChannels.includes("SMS") ? userData.sms || "" : "",
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
		const channelStr = data.channel.join(" + ");

		const scheduledDateTime = new Date(`${data.scheduledDateTime.date} ${data.scheduledDateTime.time}`);
		const now = new Date();
		const isPast = scheduledDateTime <= now;
		const status = isPast ? "Active" : "Scheduled";
		const statusColor = isPast ? "text-textGreen" : "text-warning";
		const scheduledDateTimeStr = `${format(scheduledDateTime, 'MMM dd, yyyy')}, ${format(scheduledDateTime, 'hh:mm a')}`;

		const newItem = {
			id: editIndex !== null ? list[editIndex].id : list.length + 1,
			scheduleID: editIndex !== null ? list[editIndex].scheduleID : `#SCHD-${123 + list.length + 1}`,
			messageTitle: data.messageTitle,
			notificationType: data.notificationType,
			channel: data.channel,
			pushNotification: data.channel.includes("Push") ? data.pushNotification : "",
			email: data.channel.includes("Email") ? data.email : "",
			sms: data.channel.includes("SMS") ? data.sms : "",

			targetAudience: data.targetAudience,
			scheduledDateTime: data.scheduledDateTime,
			timezone: data.timezone,
			recurringNotification: data.recurringNotification,
			status,
			statusColor,
			scheduledTime: scheduledDateTimeStr,
		};

		const updatedList = [...list];
		if (editIndex !== null) {
			updatedList[editIndex] = newItem;
		} else {
			updatedList.push(newItem);
		}

		setList?.(updatedList);
		toast.success(`Notification ${editIndex !== null ? "updated" : "added"} successfully!`);
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
								items={notificationTypeOptions.map((item: any) => ({ value: item.id, text: item.title }))}
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
										{...register("channel")}
										className="peer hidden"
										value="Push"
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
										items={pushNotificationTemplateOptions.map(item => ({ value: item.id, text: item.title }))}
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
										{...register("channel")}
										className="peer hidden"
										value="Email"
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
										items={emailTemplateOptions.map(item => ({ value: item.id, text: item.title }))}
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
										{...register("channel")}
										className="peer hidden"
										value="SMS"
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
										items={smsTemplateOptions.map(item => ({ value: item.id, text: item.title }))}
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
								items={targetAudienceOptions.map(item => ({ value: item.id, text: item.title }))}
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
								items={timezoneOptions.map(zone => ({ value: zone.id, text: zone.title }))}
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
								items={recurringNotificationOptions.map(item => ({ value: item.id, text: item.title }))}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>
					</div>

					{/* Action Buttons */}

					<div className="flex justify-end gap-4 mt-0 sm:mt-2">
						<Button
							type="button"
							className="text-sm sm:text-base w-full sm:w-[127px] px-6 !py-[10.3px] sm:!py-[15.1px] border border-text dark:border-bgc rounded-xl font-semibold text-text dark:text-textDark bg-transparent hover:!bg-transparent"
							onClick={() => {
								setIsOpen(false)
								reset();
							}}>
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
