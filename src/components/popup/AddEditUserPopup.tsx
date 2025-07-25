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
import { apiClient } from "api/client";

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	list?: any[];
	setList?: (val: any[]) => void;
	editIndex?: number | null;
	roles: any[];
};

const statusOptions = ["Active", "Suspend"] as const;

type Status = (typeof statusOptions)[number];

interface PresignedUrlResponse {
	data: any;
	url: string;
	imageUrl: string;
}

interface FormData {
	fullName: string;
	email: string;
	mobile: string | null;
	password: string;
	role: string[];
	status: Status;
	subscriptionPlan: "Free Tier" | "Premium Tier";
	profilePicture: string;
}

const getSchema = (editIndex: number | null, roles: any[]) =>
	yup
		.object({
			fullName: yup.string().required("Full Name is required"),
			email: yup.string().email("Invalid email").required("Email is required"),
			mobile: yup
				.string()
				.nullable()
				.test("mobile-verification", "Please enter mobile number", function (value) {
					return !this.parent._verifyClicked || (value !== null && value !== "");
				}),
			password:
				editIndex === null
					? yup
						.string()
						.min(8, "*Password must be at least 8 characters.")
						.matches(/[A-Z]/, "*Password must contain at least one uppercase letter.")
						.matches(/[a-z]/, "*Password must contain at least one lowercase letter.")
						.matches(/[0-9]/, "*Password must contain at least one number.")
						.matches(/[@$!%*?&#]/, "*Password must contain at least one special character.")
						.required("*Password is required.")
					: yup.string().default("").notRequired(),
			role: yup
				.array()
				.of(yup.string().oneOf(roles.map(r => r.value)))
				.min(1, "At least one role is required")
				.required("Role is required"),
			status: yup.mixed<Status>().oneOf(statusOptions).required("Status is required"),
			subscriptionPlan: yup
				.string()
				.oneOf(["Free Tier", "Premium Tier"]),
			profilePicture: yup.string().default("").notRequired(), // always string
		})
		.required();

const AddEditUserPopup: React.FC<Props> = ({ isOpen, setIsOpen, list = [], setList, editIndex = null, roles = [] }) => {
	const isDark = useAppState(state => state.isDark);

	const countries = [
		{ code: "+1", country: "us", label: "USA" },
	];
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
	const [selectedCountry, setSelectedCountry] = useState(countries[0]);
	const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const getDefaultProfilePicture = (isDark: boolean) =>
		`/assets/images/image-skelaton${!isDark ? "-dark" : "-white"}.svg`;

	const [profilePicture, setProfilePicture] = useState<string>(getDefaultProfilePicture(isDark));

	// Update profile picture if theme changes and current is default
	useEffect(() => {
		if (
			profilePicture === getDefaultProfilePicture(!isDark) || // previously set default
			profilePicture === getDefaultProfilePicture(isDark) // or current default
		) {
			setProfilePicture(getDefaultProfilePicture(isDark));
		}
		// eslint-disable-next-line
	}, [isDark]);

	const schema = getSchema(editIndex, roles);
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
		resolver,
		defaultValues: {
			subscriptionPlan: "Free Tier",
			profilePicture: getDefaultProfilePicture(isDark),
		},
	});

	useEffect(() => {
		if (editIndex !== null && list[editIndex]) {
			const userData = list[editIndex];
			const rolesFromUser = userData.role.map((r: { uuid: string; name: string }) => r.uuid);

			setSelectedRoles(rolesFromUser);
			reset({
				id: userData.id || null,
				fullName: userData.name || "",
				email: userData.email || "",
				status: userData.status == 'Suspended' ? 'Suspend' : userData.status,
				role: rolesFromUser,
				subscriptionPlan: userData.plan?.toLowerCase()
					?.split(' ')
					?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					?.join(' '),
				profilePicture: userData.avatar
					? userData.avatar
					: getDefaultProfilePicture(isDark),
			});
			if (userData.avatar) {
				setProfilePicture(userData.avatar);
			}
		} else {
			reset({
				subscriptionPlan: "Free Tier",
				profilePicture: getDefaultProfilePicture(isDark),
			});
			setProfilePicture(getDefaultProfilePicture(isDark));
			setSelectedRoles([]);
		}
	}, [isOpen, editIndex, list, reset, isDark]);

	const handleDeletePicture = () => {
		setProfilePicture(getDefaultProfilePicture(isDark));
		toast.success("Profile picture deleted successfully!");
	};

	const generatePassword = () => {
		const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&#";
		let password = "";
		// Ensure at least one of each required character type
		const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const lower = "abcdefghijklmnopqrstuvwxyz";
		const number = "0123456789";
		const special = "@$!%*?&#";
		password += upper[Math.floor(Math.random() * upper.length)];
		password += lower[Math.floor(Math.random() * lower.length)];
		password += number[Math.floor(Math.random() * number.length)];
		password += special[Math.floor(Math.random() * special.length)];
		for (let i = 4; i < 12; i++) {
			password += chars[Math.floor(Math.random() * chars.length)];
		}
		// Shuffle password to avoid predictable order
		password = password
			.split("")
			.sort(() => 0.5 - Math.random())
			.join("");
		setValue("password", password, { shouldValidate: true });
	};

	const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
		if (editIndex !== null) {
			updateExistingUser(data);
		} else {
			addNewUser(data);
		}
	};

	const updateExistingUser = async (data: FormData) => {
		try {
			const userData = list[editIndex];
			const uniqueRoles = Array.from(
				new Map(data.role.map(role => [role.value, role])).values()
			);
			const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
			const response = await apiClient.post(`api/admin/user/update`, {
				json: {
					uuid: userData.id,
					username: data.fullName,
					email: data.email,
					profile_picture: profilePicture.includes('/assets/images/image-skelaton') ? '/assets/images/user.png' : profilePicture,
					roles: uniqueRoles,
					is_suspended: data.status === 'Active' ? false : true,
					plan: data.subscriptionPlan?.toUpperCase(),
				},
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "application/json",
				}
			})

			if (response.ok) {
				toast.success(`User ${editIndex !== null ? "updated" : "added"} successfully!`);
				setIsOpen(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const addNewUser = async (data: FormData) => {
		try {
			const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
			const response = await apiClient.post('api/admin/user/create', {
				json: {
					username: data.fullName,
					email: data.email,
					profile_picture: profilePicture.includes('/assets/images/image-skelaton') ? '/assets/images/user.png' : profilePicture,
					roles: data.role,
					is_suspended: data.status === 'Active' ? false : true,
					password: data.password,
					plan: data.subscriptionPlan?.toUpperCase(),
				},
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "application/json",
				}
			})

			if (response.ok) {
				toast.success(`User ${editIndex !== null ? "updated" : "added"} successfully!`);
				setIsOpen(false);
			}
		} catch (error) {

		}
	};

	const getPresignedUrl = async (fileName: string, fileType: string): Promise<PresignedUrlResponse> => {
		const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
		const response = await apiClient.post("api/user/p-u", {
			body: JSON.stringify({
				file_name: fileName,
				file_type: fileType,
			}),
			headers: {
				Authorization: `Bearer ${authToken}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to get presigned URL");
		}

		const data: PresignedUrlResponse = await response.json();
		return data;
	};

	const uploadImageToS3 = async (presignedUrl: string, fileUrl: string, file: File): Promise<void> => {
		const response = await fetch(presignedUrl, {
			method: "PUT",
			body: file,
			headers: {
				"Content-Type": file.type,
			},
		});

		if (!response.ok) {
			throw new Error("Failed to upload image to S3");
		}

		setProfilePicture(fileUrl);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfilePicture(reader.result as string);
			};
			reader.readAsDataURL(file);

			// Extract file name and type
			const fileName = file.name.split(".")[0];
			const fileType = file.type.split("/")[1];

			const urlData = await getPresignedUrl(fileName, fileType);

			const imageData = urlData.data;

			await uploadImageToS3(imageData.presigned_url, imageData.file_url, file);
		} catch (error) {
			console.error("Error uploading profile picture:", error);
			toast.error("Failed to upload profile picture. Please try again.");
		}
	};

	return (
		<Modal
			openModal={isOpen}
			setOpenModal={() => {
				setIsOpen(false);
				reset();
			}}
			size="md">
			<div className="">
				<Dialog.Title className="text-base sm:text-2xl font-semibold text-text dark:text-textDark leading-[16px] sm:leading-[24px] mb-4 sm:mb-8">
					{editIndex !== null ? "Edit User" : "Add New User"}
				</Dialog.Title>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
					{/* Profile Picture Upload */}
					<div className="flex items-center gap-4 sm:gap-8 flex-[0_0_auto]">
						<div className="flex items-center justify-center w-[62px] h-[62px] sm:w-20 sm:h-20 rounded-full ring-1 ring-textSecondary/20 bg-fgc dark:bg-bgcDark">
							<img
								className={`${profilePicture !== `/assets/images/image-skelaton${!isDark ? "-dark" : "-white"}.svg` ? "w-full h-full object-cover rounded-full" : "w-6 h-6 sm:w-8 sm:h-8"}`}
								alt="Profile"
								src={profilePicture}
							/>
						</div>

						<div className="flex items-center gap-3 sm:gap-3.5 flex-[0_0_auto] ">
							<label className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-md inline-flex items-center justify-center  whitespace-nowrap flex-[0_0_auto] bg-primary cursor-pointer h-8 sm:h-[38px]">
								<Input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
								<div className="font-medium text-text text-[10px] sm:text-xs">
									{editIndex !== null ? "Change Picture" : "Upload Picture"}
								</div>
							</label>

							{profilePicture !== `/assets/images/image-skelaton${!isDark ? "-dark" : "-white"}.svg` && (
								<Button
									type="button"
									onClick={handleDeletePicture}
									className="inline-flex items-center justify-center !px-4 !py-2 sm:!px-6 sm:!py-2.5 whitespace-nowrap flex-[0_0_auto] !rounded-md !border !border-solid !bg-transparent !border-red-500 !font-medium !text-red-500 !text-[10px] sm:!text-xs">
									Delete Picture
								</Button>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1  sm:grid-cols-2 gap-4 sm:gap-6">
						{/* Full Name */}
						<div className="flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Full Name <span className="text-red-500">*</span>
							</label>
							<Input
								{...register("fullName")}
								placeholder="Enter Full Name"
								className="!bg-transparent !border-textSecondary/20 !w-full "
								error={errors?.fullName?.message}
							/>
						</div>

						{/* Role Selection */}
						<MultiSelect
							name="Roles"
							label="Roles"
							required
							items={[...roles].map(role => ({
								...role,
								disabled: selectedRoles.includes("User") && role.value !== "User"
							}))}
							value={selectedRoles}
							onChange={vals => {
								const selectedTexts = roles.filter(r => vals.includes(r.value)).map(r => r.text);

								const isUserSelected = selectedTexts.includes("User");

								let newVals = vals;
								if (isUserSelected) {
									const userRole = roles.find(r => r.text === "User");
									if (userRole) {
										newVals = [userRole.value];
									}
								} else {
									const userRole = roles.find(r => r.text === "User");
									if (userRole && newVals.includes(userRole.value)) {
										newVals = newVals.filter(v => v !== userRole.value);
									}
								}

								setSelectedRoles(newVals);
								setValue("role", newVals, { shouldValidate: true });
								trigger("role");
							}}
							error={errors?.role?.message}
							className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
							itemClassName="w-[280px] whitespace-nowrap text-ellipsis overflow-hidden"
						/>

						{/* Email */}
						<div className="flex flex-col gap-2 sm:gap-3">
							<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
								Email Address <span className="text-red-500">*</span>
							</label>
							<Input
								{...register("email")}
								type="email"
								placeholder="Enter Email Address"
								className="!bg-transparent !border-textSecondary/20 !w-full"
								error={errors?.email?.message}
								disabled={editIndex != null}
							/>
						</div>

						{/* Password */}
						{editIndex === null && (
							<div className="flex flex-col gap-2 sm:gap-3">
								<label className="text-xs sm:text-base  font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
									Password <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<Input
										{...register("password")}
										type="text"
										placeholder="Enter or Generate Password"
										className="!bg-transparent !border-textSecondary/20 !w-full"
										error={errors?.password?.message}
									/>
									<Icon
										icon="auto-password"
										className={`absolute ${errors.password?.message === "*Password is required."
											? "top-[34%] sm:top-[38%]"
											: `${errors.password?.message ? "top-[25%] sm:top-[28%]" : "top-1/2"}`
											} right-3 z-10 w-4 h-4 sm:h-6 sm:w-6 -translate-y-1/2 cursor-pointer text-textTurnery`}
										onClick={() => {
											generatePassword();
											trigger("password");
										}}
									/>
								</div>
							</div>
						)}

						{/* Mobile Number */}
						{/* <div className="w-full flex flex-col gap-3 relative">
							<label className="text-sm font-medium text-text dark:text-textDark">Mobile Number</label>
							<div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full relative">
								<div className="flex items-center gap-2 sm:gap-3 w-full">
									<div className="w-[77px] sm:w-[102px]  shrink-0 relative" ref={dropdownRef}>
										<button
											type="button"
											className="flex items-center justify-between w-full bg-transparent rounded-xl px-2 py-[10.3px] sm:px-2.5 sm:py-[15px] text-sm text-text dark:text-textDark border border-textSecondary/20 whitespace-nowrap"
											onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}>
											<span className="text-sm sm:text-base flex items-center gap-1 sm:gap-2">
												<img
													src={`/assets/images/${selectedCountry.country}.svg`}
													alt=""
													className="size-[18px] sm:size-6"
												/>
												{selectedCountry.code}
											</span>
											<Icon icon="chevron-down" className="w-4 h-4 ml-1" />
										</button>

										{countryDropdownOpen && (
											<div className="absolute mt-2 w-full bg-bgc dark:bg-bgcDark rounded-xl shadow-lg border border-textSecondary/20 z-20 text-text dark:text-textDark">
												{countries.map(option => (
													<div
														key={option.code}
														onClick={() => {
															setSelectedCountry({
																country: option.country,
																code: option.code,
																label: option.label,
															});
															setCountryDropdownOpen(false);
															// setValue("countryCode", option.code);
														}}
														className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
														<span className="flex items-center gap-2 text-sm sm:text-base">
															<img
																src={`/assets/images/${option.country}.svg`}
																alt=""
																className="size-[18px] sm:size-6 "
															/>
															{option.code}
														</span>
													</div>
												))}
											</div>
										)}
									</div>
									<div className={`w-full`}>
										<Input
											{...register("mobile")}
											placeholder="Enter mobile number"
											className="!bg-transparent !border-textSecondary/20 !w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
											type="number"
											inputMode="numeric"
											pattern="[0-9]*"
										/>
									</div>
								</div>
							</div>
							{errors.mobile && <p className="text-xs text-red-400">{errors.mobile.message}</p>}
						</div> */}

						{/* Status */}
						<div className={`w-full ${editIndex !== null ? "sm:col-span-2" : ""}	`}>
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
					</div>

					{/* Subscription Plan */}
					<div className="flex flex-col gap-3">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							Subscription Plan
						</label>
						<div className="flex flex-col sm:flex-row gap-3">
							{["Free Tier", "Premium Tier"].map(plan => (
								<label
									key={plan}
									tabIndex={0}
									role="button"
									onClick={() =>
										setValue(
											"subscriptionPlan",
											plan as "Free Tier" | "Premium Tier",
											{ shouldValidate: true },
										)
									}
									className={`relative flex items-center gap-3 px-2 py-[12.3px] sm:px-4 sm:py-[15.1px] rounded-xl border cursor-pointer select-none w-full ${getValues("subscriptionPlan") === plan
										? "border-primary"
										: "border-textSecondary/20"
										}`}>
									<input
										type="radio"
										{...register("subscriptionPlan")}
										value={plan}
										checked={getValues("subscriptionPlan") === plan}
										onChange={() =>
											setValue(
												"subscriptionPlan",
												plan as "Free Tier" | "Premium Tier",
												{ shouldValidate: true },
											)
										}
										className="hidden"
									/>
									<div
										className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ${getValues("subscriptionPlan") === plan
											? "border-primary"
											: "border-textSecondary/20"
											}`}>
										<div
											className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary transition-opacity ${getValues("subscriptionPlan") === plan ? "opacity-100" : "opacity-0"
												}`}
										/>
									</div>
									<span className="text-xs sm:text-base text-text dark:text-textDark">{plan}</span>
								</label>
							))}
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
							{editIndex === null ? "Add User" : "save"}
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default AddEditUserPopup;
