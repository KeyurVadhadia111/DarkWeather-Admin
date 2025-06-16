import React from "react";
import { Input } from "../utils/Input";
import { Button } from "components/utils/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "components/layout/modal";
import { toast } from "components/utils/toast";

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	email: string;
	onResetPassword?: (newPassword: string) => void;
	onSendResetLink?: () => void;
};

const schema = yup.object().shape({
	newPassword: yup.string().required("New Password is required").min(8, "Password must be at least 8 characters"),
	confirmPassword: yup
		.string()
		.required("Confirm New Password is required")
		.oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

type FormValues = {
	newPassword: string;
	confirmPassword: string;
};

const ResertPasswordPopup: React.FC<Props> = ({ isOpen, setIsOpen, email, onResetPassword, onSendResetLink }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormValues>({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: FormValues) => {
		if (onResetPassword) {
			onResetPassword(data.newPassword);
		}
		toast.success("Password has been reset successfully.");
		setIsOpen(false);
		reset();
	};

	return (
		<Modal openModal={isOpen} setOpenModal={setIsOpen} size="sm">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col items-start gap-1 sm:gap-2.5">
					<h2 className="text-text dark:text-textDark text-base sm:text-2xl font-semibold leading-[17px] sm:leading-[24px]">
						Reset Password
					</h2>
					<div className="text-xs sm:text-base text-textSecondary dark:text-textDark leading-[18px] sm:leading-[24px]">
						{email}
					</div>
				</div>
				<Button
					type="button"
					className="text-sm sm:text-base w-full sm:w-[270px] px-6 !py-[10.3px] sm:!py-[15.1px] border border-text dark:border-bgc rounded-xl font-semibold text-text dark:text-textDark bg-transparent hover:!bg-transparent sm:mt-2"
					onClick={onSendResetLink}>
					Send Reset Password Link
				</Button>
				<div className="flex items-center justify-center sm:my-2">
					<div className="w-[92px] border-t border-textSecondary/10 dark:border-textSecondary/40"></div>
					<span className="mx-2 text-xs text-textSecondary">Or</span>
					<div className="w-[92px] border-t border-textSecondary/10 dark:border-textSecondary/40"></div>
				</div>
				<form className="flex flex-col gap-4 sm:gap-8" onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-sm font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px] ">
								New Password <span className="text-red-500">*</span>
							</label>
							<Input
								type="password"
								placeholder="Enter New Password"
								{...register("newPassword")}
								error={errors.newPassword?.message}
								className="!bg-transparent !border-textSecondary/20 !w-full"
							/>
						</div>
						<div className="flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-sm font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px] ">
								Confirm New Password <span className="text-red-500">*</span>
							</label>
							<Input
								type="password"
								placeholder="Confirm New Password"
								{...register("confirmPassword")}
								error={errors.confirmPassword?.message}
								className="!bg-transparent !border-textSecondary/20 !w-full"
							/>
						</div>
					</div>
					<div className="flex justify-end gap-4">
						<Button
							type="button"
							className="text-sm sm:text-base w-full sm:w-[127px] px-6 !py-[10.3px] sm:!py-[15.1px] border border-text dark:border-bgc rounded-xl font-semibold text-text dark:text-textDark bg-transparent hover:!bg-transparent"
							onClick={() => {
								setIsOpen(false);
								reset();
							}}>
							Cancel
						</Button>
						<Button
							type="submit"
							className="text-sm sm:text-base w-full sm:w-auto px-6 !py-[10.3px] sm:!py-[15.1px] bg-primary rounded-xl font-semibold text-text">
							Reset Password
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default ResertPasswordPopup;
