import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm, Resolver, Controller, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "@headlessui/react";
import { Input } from "components/utils/Input";
import Modal from "components/layout/modal";
import { Button } from "components/utils/Button";
import { toast } from "components/utils/toast";
import useAppState from "components/utils/useAppState";
import Icon from "components/utils/Icon";
import Editor from "../JoditEditor";
import Select from "components/utils/Select";

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	list?: any[];
	setList?: (val: any[]) => void;
	editIndex?: number | null;
};

const typeOptions = ["News", "Article", "Update", "Announcement"] as const;


interface FormData {
	type: string;
	mainTitle: string;
	titles: {
		title: string;
		description: string;
	}[];
}

const getSchema = (editIndex: number | null) =>
	yup
		.object({
			type: yup.string().required("Content is required"),

		})
		.required();


const AddEditPostArticlePopup: React.FC<Props> = ({ isOpen, setIsOpen, list = [], setList, editIndex = null }) => {
	const isDark = useAppState(state => state.isDark);
	const fileInputRef = useRef(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const schema = getSchema(editIndex);
	const [content, setContent] = useState("");
	const resolver: Resolver<FormData> = yupResolver(schema) as unknown as Resolver<FormData>;
	const [imageData, setImageData] = useState<string | null>(null);
	const statusRef = useRef<"Published" | "Draft">("Draft");

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
			titles: [{ title: "", description: "" }],
		},
		resolver
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "titles",
	});

	useEffect(() => {
		if (editIndex !== null && list[editIndex]) {
			const userData = list[editIndex];
			reset({
				type: userData.type || "",
			});
		}
	}, [editIndex, isOpen, list, reset]);

	const onSubmit: SubmitHandler<FormData> = (data) => {
		const finalData = {
			...data,
			image: imageData,
			status: statusRef.current,
		};
		console.log("finalData", finalData)
		if (editIndex !== null) {
			const updatedList = [...list];
			updatedList[editIndex] = finalData;
			setList?.(updatedList);
		} else {
			setList?.([...list, finalData]);
		}

		toast.success(`Weather alert ${editIndex !== null ? "updated" : "added"} successfully!`);
		setIsOpen(false);
		reset();
		setContent("");
		setImageData(null);
		setImagePreview(null);
	};



	const handleDivClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64Image = reader.result as string;
				setImagePreview(base64Image);
				setImageData(base64Image);
			};
			reader.readAsDataURL(file);
		}
	};


	return (
		<Modal
			openModal={isOpen}
			setOpenModal={() => {
				// setIsOpen(false);
				// reset();
			}}
			size="760">
			<div className="">
				<Dialog.Title className="text-base sm:text-2xl font-semibold text-text dark:text-textDark leading-[16px] sm:leading-[24px] mb-4 sm:mb-8">
					{editIndex !== null ? "Edit Post \ Article" : "Add New Post \ Article"}
				</Dialog.Title>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">

					<div className="flex flex-col gap-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
							<div className={`col-span-2 flex flex-col gap-2 sm:gap-3`}>
								<Select
									name="type"
									label="Type"
									required
									register={register}
									trigger={trigger}
									error={errors?.type?.message}
									items={typeOptions.map(type => ({ value: type, text: type }))}
									className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
								/>
							</div>

							<div className="relative col-span-2 flex flex-col gap-2 sm:gap-3">
								<div className="flex justify-between items-center">
									<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
										Main Title
									</label>
								</div>
								<Controller
									name="mainTitle"
									control={control}
									defaultValue=""
									render={({ field }) => (
										<Editor value={field.value} onChange={field.onChange} customClass="jodit-instance" />
									)}
								/>
								{/* <textarea id="editor">Some text</textarea> */}

							</div>

							<div className="relative col-span-2 flex flex-col gap-2 sm:gap-3">
								<h2 className="text-lg font-medium text-text dark:text-textDark">Add Picture</h2>

								{/* Clickable Upload Box */}
								<div
									className="h-[200px] border-2 border-dotted border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer  transition"
									onClick={handleDivClick}
								>
									{imagePreview ? (
										<img
											src={imagePreview}
											alt="Preview"
											className="h-[200px] w-[100%] object-fit rounded-md"
										/>
									) : (
										<>
											<Icon icon="Cloud" className="w-10 h-10 text-gray-500 mb-2" />
											<p className="text-sm text-gray-600 text-center">
												Drop file here or click to browse
											</p>
										</>
									)}
								</div>

								{/* Hidden file input */}
								<input
									type="file"
									accept="image/*"
									ref={fileInputRef}
									onChange={handleFileChange}
									className="hidden"
								/>
							</div>
							{fields.map((item, index) => (
								<div
									key={item.id}
									className="relative col-span-2 flex flex-col gap-2 sm:gap-3 rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4"
								>
									{fields.length > 1 && (
										<button
											type="button"
											onClick={() => remove(index)}
											className="absolute top-0 right-0.5 text-red-500 hover:text-red-700"
										>
											<Icon icon="close" className="w-5 h-5" />
										</button>
									)}

									<div className="flex justify-between items-center">
										<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
											Title
										</label>
									</div>

									<Controller
										name={`titles.${index}.title`}
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Editor value={field.value} onChange={field.onChange} customClass={`jodit-instance-${index}-title`}
												styleOverrides={{
													'--toolbar-top': index === 0 ? '5%' : index === 1 ? '2%' : '1%', '--toolbar-right': '25px',
													'--workplace-height': '56px',
												}}
											/>
										)}
									/>

									<div className="relative col-span-2 flex flex-col gap-2 sm:gap-3">
										<div className="flex justify-between items-center">
											<label className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px]">
												Description
											</label>
										</div>

										<Controller
											name={`titles.${index}.description`}
											control={control}
											defaultValue=""
											render={({ field }) => (
												<Editor value={field.value} onChange={field.onChange} customClass={`jodit-instance-${index}-desc`} styleOverrides={{
													'--toolbar-top': '0%',
													'--toolbar-right': '5px',
													'--workplace-height': '100px',
												}} />
											)}
										/>
									</div>
								</div>
							))}

							<div className="col-span-2 text-primary font-medium text-base text-right w-full">
								<button
									type="button"
									onClick={() =>
										append({ title: "", description: "" })
									}
								>
									+ Add More Titles & Description
								</button>
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
						{!editIndex && (
							<Button
								type="submit"
								variant="outline"
								className="text-sm sm:text-base w-full sm:w-auto px-6 !py-[10.3px] sm:!py-[15.1px] rounded-xl font-semibold text-text"
								onClick={() => {
									statusRef.current = "Draft";
									handleSubmit(onSubmit)();
								}}
							>
								Save as draft
							</Button>
						)}
						<Button
							type="submit"
							className="text-sm sm:text-base w-full sm:w-auto px-6 !py-[10.3px] sm:!py-[15.1px] bg-primary rounded-xl font-semibold text-text"
							onClick={() => {
								statusRef.current = "Published";
								handleSubmit(onSubmit)();
							}}
						>
							{editIndex === null ? "Save and Publish" : "save"}
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default AddEditPostArticlePopup;
