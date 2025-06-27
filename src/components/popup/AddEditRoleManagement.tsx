import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm, Resolver, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "@headlessui/react";
import { Input } from "components/utils/Input";
import Modal from "components/layout/modal";
import Icon from "components/utils/Icon";
import { Button } from "components/utils/Button";
import { toast } from "components/utils/toast";
import useAppState from "components/utils/useAppState";
import { Path } from "react-hook-form";

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	list?: any[];
	setList?: (val: any[]) => void;
	editIndex?: number | null;
	mode?: "view";
};

interface FormData {
	role: string;
	desc: string;
	access: {
		[module: string]: {
			[permission: string]: boolean;
		};
	};
}



const getSchema = (editIndex: number | null) =>
	yup
		.object({
		})
		.required();

const AddEditRoleManagement: React.FC<Props> = ({ isOpen, setIsOpen, list = [], setList, editIndex = null, mode = "view" }) => {
	const isDark = useAppState(state => state.isDark);

	const getDefaultProfilePicture = (isDark: boolean) =>
		`/assets/images/image-skelaton${!isDark ? "-dark" : "-white"}.svg`;

	const [profilePicture, setProfilePicture] = useState<string>(getDefaultProfilePicture(isDark));

	// Update profile picture if theme changes and current is default
	useEffect(() => {
		if (
			profilePicture === getDefaultProfilePicture(!isDark) ||
			profilePicture === getDefaultProfilePicture(isDark)
		) {
			setProfilePicture(getDefaultProfilePicture(isDark));
		}
		// eslint-disable-next-line
	}, [isDark]);

	const schema = getSchema(editIndex);
	const resolver: Resolver<FormData> = yupResolver(schema) as unknown as Resolver<FormData>;

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		control,
		reset,
		trigger,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			role: '',
			desc: '',
			access: {},
		},
	});


	useEffect(() => {
		if (editIndex !== null && list[editIndex]) {
			const userData = list[editIndex];

			const accessData = userData.access || {};

			reset({
				role: userData.role || '',
				desc: userData.desc || '',
				access: accessData,
			});
		}
	}, [editIndex, list, reset]);




	const onSubmit: SubmitHandler<FormData> = (data) => {
		console.log("role data", data);

		if (editIndex !== null) {
			const updatedList = [...list];
			updatedList[editIndex] = {
				...updatedList[editIndex],
				...data,
			};
			setList?.(updatedList);
		} else {
			const newId = list.length > 0 ? Math.max(...list.map(u => u.id || 0)) + 1 : 1;
			const newEntry = {
				id: newId,
				...data,
			};
			setList?.([...list, newEntry]);
		}

		toast.success(`Role ${editIndex !== null ? "updated" : "created"} successfully!`);
		setIsOpen(false);
	};



	const AccordionItem = ({ title, isOpen, onToggle, children }: any) => {
		return (
			<div className=" py-2.5">
				<button
					onClick={onToggle}
					className="flex justify-between items-center w-full text-left"
				>
					<span className="text-xs sm:text-base font-medium text-text dark:text-textDark">
						{title}
					</span>
					<img
						src={`/assets/images/${isOpen ? "minus" : "plus"}.svg`}
						alt={isOpen ? "Collapse" : "Expand"}
						className="w-5 h-5 fill-black"
					/>
				</button>
				{isOpen && <div className="mt-4">{children}</div>}
			</div>
		);
	};

	const [openSections, setOpenSections] = useState<string[]>([]);


	const toggleSection = (section: string) => {
		setOpenSections(prev =>
			prev.includes(section)
				? prev.filter(s => s !== section)
				: [...prev, section]
		);
	};

	const accessModules = [
		{
			title: "Dashboard",
			key: "dashboard",
			permissions: ["Create", "Edit", "Import & Export", "Track", "All"]
		},
		{
			title: "User Management",
			key: "userManagement",
			permissions: ["Export", "Add", "Edit", "Reset Password", "All"]
		},
		{
			title: "Override Weather Info",
			key: "overrideWeatherInfo",
			permissions: ["Add", "Edit", "View", "Delete", "All"]
		},
		{
			title: "Weather Alert",
			key: "weatherAlert",
			permissions: ["Add", "Edit", "Delete", "All"]
		},
		{
			title: "Subscription",
			key: "subscription",
			permissions: ["Create", "Edit", "Import & Export", "Track", "All"]
		},
		{
			title: "Alerts & Content Post",
			key: "alerts&ContentPost",
			permissions: ["Export", "Add", "Edit", "Reset Password", "All"]
		},
		{
			title: "Social Media Configuration",
			key: "socialMediaConfiguration",
			permissions: ["Add", "Edit", "View", "Delete", "All"]
		},
		{
			title: "Analytics & Reports",
			key: "analytics&Reports",
			permissions: ["Add", "Edit", "Delete", "All"]
		},
		{
			title: "Feedback Manager",
			key: "feedbackManager",
			permissions: ["Export", "Add", "Edit", "Reset Password", "All"]
		},
		{
			title: "Notification System",
			key: "notificationSystem",
			permissions: ["Create", "Edit", "Import & Export", "Track", "All"]
		},
		{
			title: "Audit Trail System",
			key: "auditTrailSystem",
			permissions: ["Add", "Edit", "View", "Delete", "All"]
		},
		{
			title: "Data Export & Import",
			key: "dataExport&Import",
			permissions: ["Add", "Edit", "Delete", "All"]
		},
		{
			title: "Scheduled Maintenance",
			key: "scheduledMaintenance",
			permissions: ["Export", "Add", "Edit", "Reset Password", "All"]
		}
	];


	return (
		<Modal
			openModal={isOpen}
			setOpenModal={() => setIsOpen(false)}
			size="940"
		>
			<div className="">
				<Dialog.Title className="text-base sm:text-2xl font-semibold text-text dark:text-textDark leading-[16px] sm:leading-[24px] mb-4 sm:mb-4">
					{editIndex !== null ? "Edit Analytics Role" : "Add New Role"}
				</Dialog.Title>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">

					{/* Role Name */}
					<div className="flex flex-col gap-2">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							Alert
						</label>
						<Input
							{...register("role")}
							placeholder="Enter Role"
							className="!bg-transparent !border-textSecondary/20 !w-full "
							error={errors?.role?.message}
						/>
					</div>

					{/* Role Description */}
					<div className="flex flex-col gap-2">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
							Description
						</label>
						<Input
							{...register("desc")}
							placeholder="Enter Role Description"
							className="!bg-transparent !border-textSecondary/20 !w-full "
							error={errors?.desc?.message}
						/>
					</div>
					<div>
						{/* Access Section */}
						<h3 className="text-sm sm:text-xl font-semibold text-text dark:text-textDark">Access</h3>

						{accessModules.map(({ title, key, permissions }) => (
							<AccordionItem
								key={key}
								title={title}
								isOpen={openSections.includes(title)}
								onToggle={() => toggleSection(title)}
							>
								<div className="flex flex-wrap p-4 gap-3 rounded-xl bg-[#F8F8F8] dark:bg-bgcDark">
									{permissions.map((perm: any) => {
										const permKey = perm.replace(/\s|&/g, '').toLowerCase();

										return (
											// <label key={perm} className="w-[123px] sm:w-full sm:max-w-[150px] flex items-center gap-2 text-xs sm:text-sm text-textSecondary cursor-pointer">
											// 	<input
											// 		type="checkbox"
											// 		{...register(`access.${key}.${permKey}` as Path<FormData>)}
											// 		className="w-4 h-4 rounded-md border border-[#808080] text-[#1C282B] checked:bg-[#FFA500] checked:border-[#FFA500] accent-[#FFA500] cursor-pointer bg-transparent"
											// 	/>
											// 	{perm}
											// </label>
											<label
												key={perm}
												className="relative flex items-center gap-2 text-xs sm:text-sm text-textSecondary dark:text-white cursor-pointer w-[123px] sm:w-full sm:max-w-[150px]"
											>
												<input
													type="checkbox"
													{...register(`access.${key}.${permKey}` as Path<FormData>)}
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
												{perm}
											</label>
										);
									})}
								</div>
							</AccordionItem>
						))}

					</div>
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
							{editIndex === null ? "Add Role" : "save"}
						</Button>
					</div>
				</form>


			</div>

		</Modal>
	);
};

export default AddEditRoleManagement;
