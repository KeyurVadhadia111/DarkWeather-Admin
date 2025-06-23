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
import MultiSelect from "components/utils/MultiSelect";
import TimePicker from "components/common/TimePicker";

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	list?: any[];
	setList?: (val: any[]) => void;
	editIndex?: number | null;
};

const statusOptions = ["Active", "Suspend", "Inactive", "Pending"] as const;
const severityOptions = ["High", "Extreme", "Moderate", "Low"] as const;

type Status = (typeof statusOptions)[number];

interface FormData {
	alert: string;
	dueTo: string;
	severity: string;
	status: Status;
	startDateTime: {
		startDate: string;
		startTime?: string;
	};
	endDateTime: {
		startDate: string;
		startTime?: string;
	};
}

const getSchema = (editIndex: number | null) =>
	yup
		.object({
			alert: yup.string().required("Alert is required"),
			dueTo: yup.string().required("Due To is required"),
			severity: yup.string().required("Severity is required"),
			status: yup.mixed<Status>().oneOf(statusOptions).required("Status is required"),
			startDateTime: yup.object({
				startDate: yup.string().required("Start date is required"),
				startTime: yup.string().optional(),
			}),
			endDateTime: yup.object({
				startDate: yup.string().required("End date is required"),
				startTime: yup.string().optional(),
			}),
		})
		.required();


const AddEditWeatherAlertPopup: React.FC<Props> = ({ isOpen, setIsOpen, list = [], setList, editIndex = null }) => {
	const isDark = useAppState(state => state.isDark);

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
				alert: userData.alert || "",
				dueTo: userData.dueTo || "",
				severity: userData.severity || "",
				status: userData.status || "Active",
				startDateTime: {
					startDate: userData.startDateTime?.startDate || "",
					startTime: userData.startDateTime?.startTime || "",
				},
				endDateTime: {
					startDate: userData.endDateTime?.startDate || "",
					startTime: userData.endDateTime?.startTime || "",
				},
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
					{editIndex !== null ? "Edit Weather Alert" : "Add Weather Alert"}
				</Dialog.Title>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
						{/* Alert */}
						<div className="col-span-2 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Alert
							</label>
							<Input
								{...register("alert")}
								placeholder="Add Alert"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.alert?.message}
							/>
						</div>
						{/* Due To */}
						<div className="col-span-2 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Due To
							</label>
							<Input
								{...register("dueTo")}
								placeholder="Add Here"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.dueTo?.message}
							/>
						</div>

						{/* Severity */}
						<div className={`col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3`}>
							<Select
								name="severity"
								label="Severity"
								required
								register={register}
								trigger={trigger}
								error={errors?.severity?.message}
								items={severityOptions.map(severity => ({ value: severity, text: severity }))}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>

						{/* Status */}
						<div className={`col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3`}>
							<Select
								name="status"
								label="Status"
								required
								register={register}
								trigger={trigger}
								error={errors?.status?.message}
								items={statusOptions.map(status => ({ value: status, text: status }))}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>

						<div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
							<label className="text-xs sm:text-sm font-medium text-text dark:text-textDark">Start Date Time</label>
							<div className="flex gap-3">
								<input {...register("startDateTime.startDate")} type="date" className="w-full sm:h-14 text-textSecondary border border-textSecondary/20 rounded-xl px-3 py-2" />
								<TimePicker
									name="startDateTime.startTime"
									register={register}
									setValue={setValue}
									getValues={getValues}
								/>


							</div>
						</div>
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
							<label className="text-xs sm:text-sm font-medium text-text dark:text-textDark">End Date Time</label>
							<div className="flex gap-3">
								<input {...register("endDateTime.startDate")} type="date" className="w-full sm:h-14 text-textSecondary border border-textSecondary/20 rounded-xl px-3 py-2" />
								<TimePicker name="endDateTime.startDate" register={register} setValue={setValue}
									getValues={getValues} />

							</div>
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

export default AddEditWeatherAlertPopup;
