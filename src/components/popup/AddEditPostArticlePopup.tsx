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
import TimePicker from "components/common/TimePicker";
import ScheduleConfirmation from "./ScheduleConfirmation";
import { apiClient } from "api/client";

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	list?: any[];
	setList?: (val: any[]) => void;
	editIndex?: number | null;
};

const typeOptions = ["News", "Article", "Top Stories", "Severe Weather", "Announcement", "Update"] as const;

interface PresignedUrlResponse {
	data: any;
	url: string;
	imageUrl: string;
}

interface FormData {
	type: string;
	publishDate?: string;
	publishTime?: string;
	mainTitle?: string;
	imageHeader?: string;
	imageThumbnail?: string;
	titles?: {
		title?: string;
		description?: string;
	}[];
}


const getSchema = (status: "Draft" | "Published", publishNow: boolean) => {
	const base = {
		type: yup.string().required("Type is required"),
		mainTitle: yup.string().required("Main title is required"),
	};

	if (status === "Published") {
		return yup.object({
			...base,
			publishDate: yup
				.string()
				.when([], {
					is: () => !publishNow,
					then: schema => schema.required("Publish date is required"),
					otherwise: schema => schema.notRequired()
				}),
			publishTime: yup.string(),
			imageHeader: yup.string().required("Header Image is required"),
			imageThumbnail: yup.string().required("Thumbnail image is required"),
			titles: yup.array().of(
				yup.object({
					title: yup.string().required("Title is required"),
					description: yup.string().required("Description is required"),
				})
			).min(1, "At least one title & description is required"),
		});
	}

	// Draft mode — only `type` is required
	return yup.object(base);
};



const AddEditPostArticlePopup: React.FC<Props> = ({ isOpen, setIsOpen, list = [], setList, editIndex = null }) => {
	const isDark = useAppState(state => state.isDark);
	const fileInputRef = useRef(null);
	const [content, setContent] = useState("");
	const [validationSchema, setValidationSchema] = useState(getSchema("Draft"));
	const resolver: Resolver<FormData> = yupResolver(validationSchema);
	const [imageData, setImageData] = useState<string | null>(null);
	const statusRef = useRef<"Published" | "Draft">("Draft");
	const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(null);
	const [thumbnailImagePreview, setThumbnailImagePreview] = useState<string | null>(null);

	const [publishNow, setPublishNow] = useState(false);
	const [headerImageData, setHeaderImageData] = useState<string | null>(null);
	const [thumbnailImageData, setThumbnailImageData] = useState<string | null>(null);
	const headerFileInputRef = useRef<HTMLInputElement | null>(null);
	const thumbnailFileInputRef = useRef<HTMLInputElement | null>(null);
	const [showScheduleConfirm, setShowScheduleConfirm] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		control,
		setError,
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
			const articleData = list[editIndex];
			const dateObj = new Date(articleData.scheduledFor);
			const publishDate = dateObj.toISOString().split("T")[0];
			const publishTime = dateObj.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			});
			reset({
				id: articleData.id || null,
				type: articleData.type || "",
				publishDate: publishDate || "",
				publishTime: publishTime || "00:00",
				mainTitle: articleData.title,
				imageHeader: articleData.headerImage || "",
				imageThumbnail: articleData.thumbnailImage || "",
				titles: articleData.titles || [{ title: "", description: "" }],
			});

			setHeaderImagePreview(articleData.headerImage || null);
			setThumbnailImagePreview(articleData.thumbnailImage || null);
		}
	}, [editIndex, isOpen, list, reset]);

	const onSubmit: SubmitHandler<FormData> = (data) => {
		if (editIndex !== null) {
			updateArticle(data);
		} else {
			createNewArticle(data);
		}
	};

	const createNewArticle = async (data: FormData) => {
		try {
			let publishAt: string | null = null;

			if (publishNow) {
				const now = new Date();
				const date = now.toISOString().slice(0, 10);
				const time = now.toTimeString().slice(0, 5);
				const dateTimeStr = `${date}T${time}:00`;
				publishAt = toLocalISOString(new Date(dateTimeStr));
			} else if (data.publishDate && data.publishTime) {
				const dateTimeStr = `${data.publishDate}T${to24HourFormat(data.publishTime)}:00`;
				publishAt = toLocalISOString(new Date(dateTimeStr));
			}

			const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
			const response = await apiClient.post('api/article/create', {
				json: {
					main_title: data.mainTitle,
					header_image: headerImagePreview,
					thumbnail_image: thumbnailImagePreview,
					type: data.type.toUpperCase().replace(' ', '_'),
					publish_at: publishAt,
					titles_descriptions: data?.titles?.map((x, index) => ({
						title: x.title,
						description: x.description,
						sequence: index
					})) || [],
					status: statusRef.current.toUpperCase(),
				},
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "application/json",
				}
			});

			if (response.status == 201) {
				toast.success(`Post ${editIndex !== null ? "updated" : "added"} successfully!`);
				setIsOpen(false);
				reset();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const updateArticle = async (data: FormData) => {
		try {
			let publishAt: string | null = null;

			if (publishNow) {
				const now = new Date();
				const date = now.toISOString().slice(0, 10);
				const time = now.toTimeString().slice(0, 5);
				const dateTimeStr = `${date}T${time}:00`;
				publishAt = toLocalISOString(new Date(dateTimeStr));
			} else if (data.publishDate && data.publishTime) {
				const dateTimeStr = `${data.publishDate}T${to24HourFormat(data.publishTime)}:00`;
				publishAt = toLocalISOString(new Date(dateTimeStr));
			}

			const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
			const response = await apiClient.put(`api/article/update/${list[editIndex].id}`, {
				json: {
					main_title: data.mainTitle,
					header_image: headerImagePreview,
					thumbnail_image: thumbnailImagePreview,
					type: data.type.toUpperCase().replace(' ', '_'),
					publish_at: publishAt,
					titles_descriptions: data?.titles?.map((x, index) => ({
						title: x.title,
						description: x.description,
						sequence: index
					})) || [],
					status: statusRef.current.toUpperCase(),
				},
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "application/json",
				}
			});

			if (response.ok) {
				toast.success(`Post ${editIndex !== null ? "updated" : "added"} successfully!`);
				setIsOpen(false);
				reset();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const toLocalISOString = (date: Date) => {
		const offset = date.getTimezoneOffset();
		const sign = offset > 0 ? "-" : "+";
		const pad = (n: number) => String(Math.abs(Math.floor(n))).padStart(2, "0");
		const hours = pad(offset / -60);
		const mins = pad(offset % 60);
		return date.toISOString().slice(0, 19) + `${sign}${hours}:${mins}`;
	}


	const handleHeaderDivClick = () => {
		headerFileInputRef.current?.click();
	};

	const handleThumbnailDivClick = () => {
		thumbnailFileInputRef.current?.click();
	};

	const to24HourFormat = (time12h: string) => {
		const [time, modifier] = time12h.split(" ");
		let [hours, minutes] = time.split(":");

		if (hours === "12") {
			hours = "00";
		}
		if (modifier.toUpperCase() === "PM") {
			hours = (parseInt(hours, 10) + 12).toString();
		}
		return `${hours.padStart(2, "0")}:${minutes}`;
	}

	const handleHeaderFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const fileName = file.name.split(".")[0];
			const fileType = file.type.split("/")[1];

			const urlData = await getPresignedUrl(fileName, fileType, 'header');

			const imageData = urlData.data;

			await uploadImageToS3(imageData.presigned_url, imageData.file_url, file, 'header');
		} catch (error) {
			console.error("Error uploading profile picture:", error);
			toast.error("Failed to upload profile picture. Please try again.");
		}
	};

	const handleThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const fileName = file.name.split(".")[0];
			const fileType = file.type.split("/")[1];

			const urlData = await getPresignedUrl(fileName, fileType, 'thumbnail');

			const imageData = urlData.data;

			await uploadImageToS3(imageData.presigned_url, imageData.file_url, file, 'thumbnail');
		} catch (error) {
			console.error("Error uploading profile picture:", error);
			toast.error("Failed to upload profile picture. Please try again.");
		}
	};

	const handleSave = async (status: "Draft" | "Published") => {
		statusRef.current = status;

		const schema = getSchema(status, publishNow);
		try {
			const values = getValues();
			await schema.validate(values, { abortEarly: false });
			handleSubmit(onSubmit)();
		} catch (err: any) {
			if (err.inner) {
				err.inner.forEach((e: any) => {
					setError(e.path, { message: e.message });
				});
			}
		}
	};

	const getPresignedUrl = async (fileName: string, fileType: string, contentType: string): Promise<PresignedUrlResponse> => {
		const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
		const response = await apiClient.post("api/article/p-u", {
			body: JSON.stringify({
				file_name: fileName,
				file_type: fileType,
				content_type: contentType,
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

	const uploadImageToS3 = async (presignedUrl: string, fileUrl: string, file: File, imageType: string): Promise<void> => {
		const response = await fetch(presignedUrl, {
			method: "PUT",
			body: file,
			headers: {
				"Content-Type": file.type,
			},
		});

		if (!response.ok) {
			throw new Error("Failed to upload image to S3");
		} else {
			if (imageType === 'thumbnail') {
				setValue("imageThumbnail", fileUrl, { shouldValidate: true });
				setThumbnailImagePreview(fileUrl);
			} else {
				setValue("imageHeader", fileUrl, { shouldValidate: true });
				setHeaderImagePreview(fileUrl);
			}
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

							<div className="col-span-2">
								<label
									htmlFor="publishNow"
									className="relative flex items-center justify-between gap-2 text-sm font-medium sm:text-base text-text dark:text-white cursor-pointer w-full"
								>
									<span>Publish Immediately</span>
									<input
										id="publishNow"
										type="checkbox"
										checked={publishNow}
										onChange={(e) => setPublishNow(e.target.checked)}
										className="peer hidden"
									/>
									<div className="w-5 h-5 shrink-0 rounded border border-gray-300 bg-white dark:bg-bgcDark peer-checked:bg-primary flex items-center justify-center">
										<svg
											className="w-3 h-3 text-white hidden peer-checked:block"
											fill="none"
											stroke="currentColor"
											strokeWidth="3"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
										</svg>
									</div>
								</label>
							</div>

							<div className="col-span-1 flex flex-col gap-2 sm:gap-3">
								<label className="text-xs sm:text-sm font-medium text-text dark:text-textDark">Publish Date</label>
								<div className="flex flex-col gap-1">
									<input {...register("publishDate")} type="date" className="w-full sm:h-14 text-textSecondary border border-textSecondary/20 rounded-xl px-3 py-2" disabled={publishNow} />
									{errors.publishDate && (
										<p className="text-red-500 text-xs mt-1">{errors.publishDate.message}</p>
									)}
								</div>
							</div>

							<div className="col-span-1 flex flex-col gap-2 sm:gap-3">
								<label className="text-xs sm:text-sm font-medium text-text dark:text-textDark">Publish Time</label>
								<div className="flex gap-3 w-full">
									<TimePicker name="publishTime" register={register} setValue={setValue}
										getValues={getValues}
										disabled={publishNow}
										error={errors.publishTime?.message}
									/>
								</div>
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
										<>
											<Editor value={field.value ?? ""} onChange={field.onChange} customClass="jodit-instance" />
											{errors.mainTitle && (
												<p className="text-red-500 text-xs">{errors.mainTitle.message}</p>
											)}
										</>
									)}
								/>
								{/* <textarea id="editor">Some text</textarea> */}

							</div>

							<div className="relative col-span-1 flex flex-col gap-2 sm:gap-3">
								<h2 className="text-lg font-medium text-text dark:text-textDark">Add Header Image</h2>

								{/* Clickable Upload Box */}
								<div
									className="h-[200px] border-2 border-dotted border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer  transition"
									onClick={handleHeaderDivClick}
								>
									{headerImagePreview ? (
										<img src={headerImagePreview} alt="Header" className="h-[200px] w-full object-cover rounded-md" />
									) : (
										<>
											<Icon icon="Cloud" className="w-10 h-10 text-gray-500 mb-2" />
											<p className="text-sm text-gray-600 text-center">Drop file here or click to browse</p>
										</>
									)}
								</div>

								{errors.imageHeader && (
									<p className="text-red-500 text-xs">{errors.imageHeader.message}</p>
								)}

								{/* Hidden file input */}
								<input
									type="file"
									accept="image/*"
									ref={headerFileInputRef}
									onChange={handleHeaderFileChange}
									className="hidden"
								/>
							</div>
							<div className="relative col-span-1 flex flex-col gap-2 sm:gap-3">
								<h2 className="text-lg font-medium text-text dark:text-textDark">Add Thumbnail Image</h2>

								{/* Clickable Upload Box */}
								<div
									className="h-[200px] border-2 border-dotted border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer  transition"
									onClick={handleThumbnailDivClick}
								>
									{thumbnailImagePreview ? (
										<img src={thumbnailImagePreview} alt="Thumbnail" className="h-[200px] w-full object-cover rounded-md" />
									) : (
										<>
											<Icon icon="Cloud" className="w-10 h-10 text-gray-500 mb-2" />
											<p className="text-sm text-gray-600 text-center">Drop file here or click to browse</p>
										</>
									)}
								</div>

								{errors.imageThumbnail && (
									<p className="text-red-500 text-xs">{errors.imageThumbnail.message}</p>
								)}

								{/* Hidden file input */}
								<input
									type="file"
									accept="image/*"
									ref={thumbnailFileInputRef}
									onChange={handleThumbnailFileChange}
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
											<>
												<Editor value={field.value ?? ""} onChange={field.onChange} customClass={`jodit-instance-${index}-title`}
													styleOverrides={{
														'--toolbar-top': index === 0 ? '5%' : index === 1 ? '2%' : '1%', '--toolbar-right': '25px',
														'--workplace-height': '56px',
													}}
												/>
												{errors.titles?.[index]?.title && (
													<p className="text-red-500 text-xs">{errors.titles[index]?.title?.message}</p>
												)}
											</>
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
												<>
													<Editor value={field.value ?? ""} onChange={field.onChange} customClass={`jodit-instance-${index}-desc`} styleOverrides={{
														'--toolbar-top': '0%',
														'--toolbar-right': '5px',
														'--workplace-height': '100px',
													}} />
													{errors.titles?.[index]?.description && (
														<p className="text-red-500 text-xs">{errors.titles[index]?.description?.message}</p>
													)}
												</>
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
						<Button
							type="button"
							variant="outline"
							className="text-sm sm:text-base w-full sm:w-auto px-6 !py-[10.3px] sm:!py-[15.1px] rounded-xl font-semibold text-text"
							onClick={() => handleSave("Draft")}
						>
							Save as draft
						</Button>
						<Button
							type="button"
							className="text-sm sm:text-base w-full sm:w-auto px-6 !py-[10.3px] sm:!py-[15.1px] bg-primary rounded-xl font-semibold text-text"
							onClick={() => setShowScheduleConfirm(true)}
						>
							Save and Publish
						</Button>
					</div>
					<ScheduleConfirmation
						isOpen={showScheduleConfirm}
						setIsOpen={setShowScheduleConfirm}
						itemType="article"
						onConfirm={() => handleSave("Published")}
					/>
				</form>

			</div>
		</Modal>
	);
};

export default AddEditPostArticlePopup;
