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
import { apiClient } from "api/client";

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

	const [accessModules, setAccessModules] = useState([]);
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
		if (editIndex !== null && list[editIndex] && accessModules.length > 0) {
			const userData = list[editIndex];

			const attachedPermissions = userData.permissions?.filter((p: any) => p.is_attached) || [];
			const permissionNames = attachedPermissions.map((p: any) => p.name);

			const accessFromPermissions = accessModules.reduce((acc, module) => {
				const isEnabled = permissionNames.includes(module.key); // match key directly
				return {
					...acc,
					[module.key]: isEnabled,
				};
			}, {} as Record<string, boolean>);

			reset({
				role: userData.role || '',
				desc: userData.desc || '',
				access: accessFromPermissions,
			});
		} else {
			reset({
				role: '',
				desc: '',
				access: [],
			});
		}
	}, [editIndex, list, reset, accessModules]);

	const onSubmit: SubmitHandler<FormData> = (data) => {
		if (editIndex !== null) {
			updateRole(data);
		} else {
			addNewRole(data);
			const newId = list.length > 0 ? Math.max(...list.map(u => u.id || 0)) + 1 : 1;
			const newEntry = {
				id: newId,
				...data,
			};
			setList?.([...list, newEntry]);
		}
	};

	const addNewRole = async (data: FormData) => {
		try {
			const selectedPermissionNames = Object.entries(data.access)
				.filter(([_, value]) => value === true)
				.map(([key]) => key);

			const selectedPermissions = accessModules
				.filter(module => selectedPermissionNames.includes(module.key))
				.map(mod => mod.uuid);

			const payload = {
				role_name: data.role,
				role_description: data.desc,
				permissions: selectedPermissions,
			};

			const response = await apiClient.post("api/admin/add/role-permission", { json: payload });
			if (response.ok) {
				toast.success(`Role ${editIndex !== null ? "updated" : "created"} successfully!`);
				setIsOpen(false);
			}
		} catch (error) {
			console.error("Update failed", error);
		}
	};


	const updateRole = async (data: FormData) => {
		try {
			const selectedPermissionNames = Object.entries(data.access)
				.filter(([_, value]) => value === true)
				.map(([key]) => key);

			const selectedPermissions = accessModules
				.filter(module => selectedPermissionNames.includes(module.key))
				.map(mod => mod.uuid);

			const payload = {
				role_uuid: list[editIndex!].id,
				role_name: data.role,
				role_description: data.desc,
				permissions: selectedPermissions,
			};

			const response = await apiClient.put("api/admin/update/role-permission", { json: payload });
			if (response.ok) {
				toast.success(`Role ${editIndex !== null ? "updated" : "created"} successfully!`);
				setIsOpen(false);
			}
		} catch (error) {
			console.error("Update failed", error);
		}
	};

	const fetchAllPermissions = async () => {
		try {
			const response = apiClient.post('api/admin/permissions/all');
			const resJson = await response.json();

			const mappedPermissions = resJson.data?.map((x) => ({
				uuid: x.uuid,
				title: x.name.toLowerCase()
					.split(' ')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' '),
				key: x.name,
			}));
			setAccessModules(mappedPermissions)
		} catch (error) {
			console.log(error);
		}
	};

	const [openSections, setOpenSections] = useState<string[]>([]);


	const toggleSection = (section: string) => {
		setOpenSections(prev =>
			prev.includes(section)
				? prev.filter(s => s !== section)
				: [...prev, section]
		);
	};

	useEffect(() => {
		fetchAllPermissions();
	}, []);

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
							Role
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
						<h3 className="text-sm sm:text-xl font-semibold text-text dark:text-textDark mb-4">Access</h3>

						<div className="flex flex-col gap-4 sm:gap-5 p-3 sm:p-4 border border-border dark:border-borderDark rounded-[20px]">
							{accessModules.map(({ title, key }) => (
								<label
									key={key}
									className="relative flex items-center justify-between gap-2 text-sm font-medium sm:text-base text-text dark:text-white cursor-pointer w-full"
								>
									{title}
									<input
										type="checkbox"
										{...register(`access.${key}` as Path<FormData>)}
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
												absolute right-0.5
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
								</label>
							))}
						</div>
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
