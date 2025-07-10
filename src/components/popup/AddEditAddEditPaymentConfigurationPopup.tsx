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
import SelectWithImages from "components/common/SelectWithImages";

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	list?: any[];
	setList?: (val: any[]) => void;
	editIndex?: number | null;
};

const paymentGatewayOptions = [
	{
		value: "paypal",
		text: "PayPal",
		icon: "/assets/payment-logos/paypal.svg",
	},
	{
		value: "razorpay",
		text: "Razorpay",
		icon: "/assets/payment-logos/razorpay-logo.png",
	},
	{
		value: "stripe",
		text: "Stripe",
		icon: "/assets/payment-logos/stripe.svg",
	},
];

const currencyOptions = [
	{ value: "INR", text: "INR - Indian Rupee" },
	{ value: "USD", text: "USD - US Dollar" },
	{ value: "EUR", text: "EUR - Euro" },
	{ value: "GBP", text: "GBP - British Pound" },
];

const countryOptions = [
	{ value: "IN", text: "India" },
	{ value: "US", text: "United States" },
	{ value: "GB", text: "United Kingdom" },
	{ value: "AU", text: "Australia" },
	{ value: "CA", text: "Canada" },
];



const statusOptions = ["Connected", "Not Connected"] as const;

interface FormData {
	paymentGateway: string;
	apiKey: string;
	customGateway: string;
	webhookURL: string;
	currency: string;
	country: string;
	status: string;
}

const getSchema = (editIndex: number | null) =>
	yup
		.object({
			paymentGateway: yup.string().required("Payment Gateway is required"),
			apiKey: yup.string().required("API Key is required"),
			customGateway: yup.string().required("Use Custom Gateway is required"),
			webhookURL: yup.string().required("Webhook URL is required"),
			currency: yup.string().required("Currency is required"),
			country: yup.string().required("Country is required"),
			status: yup.string().oneOf(["Connected", "Not Connected"]).required("Status is required"),

		})
		.required();


const AddEditAddEditPaymentConfigurationPopup: React.FC<Props> = ({ isOpen, setIsOpen, list = [], setList, editIndex = null }) => {
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
		watch,
		reset,
		trigger,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			status: "Connected",
		},
		resolver
	});

	useEffect(() => {
		if (editIndex !== null && list[editIndex]) {
			const userData = list[editIndex];
			reset({
				paymentGateway: userData.paymentGateway || "",
				apiKey: userData.apiKey || "",
				customGateway: userData.customGateway || "",
				webhookURL: userData.webhookURL || "",
				currency: userData.currency || "",
				country: userData.country || "",
				status: userData.status || "Connected",
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
		toast.success(`Payment Configuration ${editIndex !== null ? "updated" : "added"} successfully!`);
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
					{editIndex !== null ? "Edit Payment Configuration" : "Add Payment Configuration"}
				</Dialog.Title>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

						{/* Payment Gateway */}
						<div className="col-span-2 sm:col-span-2 flex flex-col gap-2 sm:gap-3">
							{/* <Select
								name="paymentGateway"
								label="Payment Gateway"
								placeholder="Select Payment Gateway"
								required
								register={register}
								trigger={trigger}
								error={errors?.channel?.message}
								items={paymentGatewayOptions.map(({ value, text, icon }) => ({
									value,
									text: (
										<div className="flex items-center gap-2">
											<img src={icon} alt={text} className="w-5 h-5 object-contain" />
											{text}
										</div>
									),
								}))}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/> */}
							<SelectWithImages
								label="Payment Gateway"
								options={paymentGatewayOptions}
								value={watch("paymentGateway")}
								onChange={(val) => setValue("paymentGateway", val)}
								error={errors?.paymentGateway?.message}
							/>

						</div>

						{/* API Key */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								API Key
							</label>
							<Input
								{...register("apiKey")}
								placeholder="Enter API Key"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.apiKey?.message}
							/>
						</div>

						{/* Use Custom Gateway */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Use Custom Gateway
							</label>
							<Input
								{...register("customGateway")}
								placeholder="Enter Use Custom Gateway"
								type="password"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.customGateway?.message}
							/>
						</div>

						{/* Webbook URL */}
						<div className="col-span-2 sm:col-span-2 flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Webbook URL
							</label>
							<Input
								{...register("webhookURL")}
								placeholder="Enter Webbook URL"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.webhookURL?.message}
							/>
						</div>

						{/* Currency */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<Select
								name="currency"
								label="Currency"
								placeholder="Select Currency"
								required
								register={register}
								trigger={trigger}
								error={errors?.currency?.message}
								items={currencyOptions}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>

						{/* Country/Region */}
						<div className="col-span-2 sm:col-span-1 flex flex-col gap-2 sm:gap-3">
							<Select
								name="country"
								label="Country/Region"
								placeholder="Select Country/Region"
								required
								register={register}
								trigger={trigger}
								error={errors?.country?.message}
								items={countryOptions}
								className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							/>
						</div>
					</div>

					{/* Action Buttons */}

					<div className="flex sm:flex-row flex-col justify-end gap-4 mt-0 sm:mt-2">
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
							{editIndex === null ? "Add Payment Configuration" : "Edit Payment Configuration"}
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default AddEditAddEditPaymentConfigurationPopup;
