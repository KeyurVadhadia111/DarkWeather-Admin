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
import Select from "components/utils/Select";
import useAppState from "components/utils/useAppState";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import TimePicker from '../common/TimePicker';

type Props = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	list?: any[];
	setList?: (val: any[]) => void;
	editIndex?: number | null;
	mode?: "view";
};

const statusOptions = ["Active", "Suspend", "Inactive", "Pending"] as const;


interface FormData {
	// Location & Time
	location: string;
	city: string;
	zipCode: string;
	effectiveFrom: {
		startDate: string;
		endDate: string;
	};
	timeRange: {
		startTime: string;
		endTime: string;
	};

	// Temperature
	highTemperature: string;
	lowTemperature: string;
	temperatureDescription: string;
	skyCondition: string;
	uvIndex: number;

	// Wind & Atmosphere
	windSpeed: string;
	windDirection: string;
	beaufortScale: number;
	humidity: string;
	dewPoint: string;
	comfortIndex: number;
	barometricPressure: string;
	cloudCover: string;

	// Sun & Moon
	sunrise: string;
	sunset: string;
	moonrise: string;
	moonset: string;
	moonPhase: string;

	// Precipitation
	precipitationProbability: string;

	status: "Active" | "Inactive";
}


const getSchema = (editIndex: number | null) =>
	yup
		.object({
		})
		.required();

const AddEditWeatherPopup: React.FC<Props> = ({ isOpen, setIsOpen, list = [], setList, editIndex = null, mode = "view" }) => {
	const isDark = useAppState(state => state.isDark);

	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
	const dropdownRef = useRef<HTMLDivElement>(null);
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
		resolver,
		defaultValues: {
			location: '',
			city: '',
			zipCode: '',
			effectiveFrom: {
				startDate: '',
				endDate: '',
			},
			timeRange: {
				startTime: '',
				endTime: '',
			},
			highTemperature: '',
			lowTemperature: '',
			temperatureDescription: '',
			skyCondition: '',
			uvIndex: 0,
			windSpeed: '',
			windDirection: '',
			beaufortScale: 0,
			humidity: '',
			dewPoint: '',
			comfortIndex: 0,
			barometricPressure: '',
			cloudCover: '',
			sunrise: '',
			sunset: '',
			moonrise: '',
			moonset: '',
			moonPhase: '',
			precipitationProbability: '',
			status: 'Active',
		},
	});

	useEffect(() => {
		if (editIndex !== null && list[editIndex]) {
			const userData = list[editIndex];
			console.log("userData", userData)
			// Parse temp
			const [highTemperature, lowTemperature] = userData.temp?.split(' / ') ?? [];

			// Parse effectiveFrom (e.g., "Jun 9, 10:00 AM – 6:00 PM")
			let startDate = '', endDate = '', startTime = '', endTime = '';
			if (userData.effectiveFrom) {
				const [datePart, timePart] = userData.effectiveFrom.split(',');
				startDate = new Date().toISOString().slice(0, 10); // fallback to today
				endDate = startDate;
				if (timePart?.includes('–')) {
					const [start, end] = timePart.split('–');
					startTime = start?.trim() ?? '';
					endTime = end?.trim() ?? '';
				}
			}

			reset({
				location: userData.location || '',
				city: userData.location,
				zipCode: '',
				effectiveFrom: {
					startDate,
					endDate,
				},
				timeRange: {
					startTime,
					endTime,
				},

				// Temperature
				highTemperature: highTemperature || '',
				lowTemperature: lowTemperature || '',
				temperatureDescription: '',
				skyCondition: userData.sky || '',
				uvIndex: 0,

				// Wind & Atmosphere
				windSpeed: userData.wind?.split(' ')[0] || '',
				windDirection: userData.wind?.split(' ')[2] || '',
				beaufortScale: 0,
				humidity: '',
				dewPoint: '',
				comfortIndex: 0,
				barometricPressure: '',
				cloudCover: '',

				// Sun & Moon
				sunrise: '',
				sunset: '',
				moonrise: '',
				moonset: '',
				moonPhase: '',

				// Precipitation
				precipitationProbability: userData.precipitation?.toString() || '',

				status: userData.status || 'Active',
			});
		}
	}, [editIndex, list, reset]);



	const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
		console.log("data", data)
		if (editIndex !== null) {
			const updatedList = [...list];
			updatedList[editIndex] = {
				...updatedList[editIndex],
				...data,
				statusColor: data.status === "Active" ? "text-textGreen" : "text-textRed",
			};
			setList?.(updatedList);
		} else {
			const newId = list.length > 0 ? Math.max(...list.map(u => u.id || 0)) + 1 : 1;
			const newEntry = {
				id: newId,
				...data,
				statusColor: data.status === "Active" ? "text-textGreen" : "text-textRed",
			};
			setList?.([...list, newEntry]);
		}

		toast.success(`Weather condition ${editIndex !== null ? "updated" : "added"} successfully!`);
		setIsOpen(false);
	};


	const AccordionItem = ({ title, isOpen, onToggle, children }: any) => {
		return (
			<div className="border-b border-textSecondary/20 py-4">
				<button
					onClick={onToggle}
					className="flex justify-between items-center w-full text-left"
				>
					<span className="text-base sm:text-[20px] font-medium text-text dark:text-textDark">
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


	const highTemperatureOptions = [
		{ value: "40", text: "40 °C" },
		{ value: "38", text: "38 °C" },
		{ value: "35", text: "35 °C" },
		{ value: "32", text: "32 °C" },
		{ value: "30", text: "30 °C" },
	];

	const lowTemperatureOptions = [
		{ value: "25", text: "25 °C" },
		{ value: "22", text: "22 °C" },
		{ value: "20", text: "20 °C" },
		{ value: "18", text: "18 °C" },
		{ value: "15", text: "15 °C" },
	];

	const skyCondition = [
		{ value: "clear", text: "Clear" },
		{ value: "cloudy", text: "Cloudy" },
		{ value: "rainy", text: "Rainy" },
		{ value: "partlyCloudy", text: "Partly Cloudy" },
	];

	const windSpeed = [
		{ value: "12", text: "12 km/h" },
		{ value: "15", text: "15 km/h" },
		{ value: "50", text: "50 km/h" },
		{ value: "30", text: "30 km/h" },
	];

	const windDirection = [
		{ value: "N", text: "North (N)" },
		{ value: "NE", text: "Northeast (NE)" },
		{ value: "E", text: "East (E)" },
		{ value: "SE", text: "Southeast (SE)" },
		{ value: "S", text: "South (S)" },
		{ value: "SW", text: "Southwest (SW)" },
		{ value: "W", text: "West (W)" },
		{ value: "NW", text: "Northwest (NW)" }
	];

	const barometricPressure = [
		{ value: "29", text: "12 Hg" },
		{ value: "35", text: "15 Hg" },
		{ value: "15", text: "50 Hg" },
		{ value: "20", text: "30 Hg" },
	]

	const moonPhases = [
		{ value: "new_moon", text: "New Moon" },
		{ value: "first_quarter", text: "First Quarter" },
		{ value: "full_moon", text: "Full Moon" },
		{ value: "last_quarter", text: "Last Quarter" }
	];

	const accordionContent: Record<string, React.ReactNode> = {
		Temperature: (
			<div className="flex flex-col w-full gap-6">
				<div className="flex gap-6">
					<div className="relative w-full">
						<Select
							{...register("highTemperature")}
							name="highTemperature"
							label="High Temperature"
							items={highTemperatureOptions}
							className="!bg-transparent !border-textSecondary/20 !text-textSecondary !w-full pr-10"
						/>
						<span className="absolute right-10 top-[72%] -translate-y-1/2 text-textSecondary text-sm pointer-events-none">
							°C
						</span>
					</div>
					<div className="relative w-full">
						<Select
							{...register("lowTemperature")}
							name="lowTemperature"
							label="Low Temperature"
							items={lowTemperatureOptions}
							className="!bg-transparent !border-textSecondary/20 !text-textSecondary !w-full pr-10"
						/>
						<span className="absolute right-10 top-[72%] -translate-y-1/2 text-textSecondary text-sm pointer-events-none">
							°C
						</span>
					</div>
				</div>
				<div className="relative flex flex-col gap-3 w-full">
					<label className="text-xs sm:text-base font-medium text-text dark:text-textDark">
						Temperature Description
					</label>
					<Input
						{...register("temperatureDescription")}
						placeholder="Enter Temperature Description"
						className="!bg-transparent !border-textSecondary/20 !w-full"
					/>
				</div>
				<div className="flex items-center gap-6 w-full">
					<div className="relative w-full ">
						<Select
							{...register("skyCondition")}
							name="skyCondition"
							label="Sky Condition"
							items={skyCondition}
							className="!bg-transparent !h-[42px] sm:!h-[56px] !border-textSecondary/20 !text-textSecondary !w-full pr-10"
						/>
					</div>
					<div className="relative flex flex-col gap-3 w-full">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark">
							UV Index
						</label>
						<Input
							{...register("uvIndex", { valueAsNumber: true })}
							type="number"
							placeholder="Enter UV Index"
							className="!bg-transparent !border-textSecondary/20 !h-[42px] sm:!h-[56px] !w-full"
						/>
					</div>
				</div>
			</div>
		),
		"Wind & Atmosphere": (
			<div className="flex flex-col w-full gap-6">
				<div className="flex gap-6">
					<div className="relative w-full">
						<Select
							{...register("windSpeed")}
							name="windSpeed"
							label="Wind Speed"
							items={windSpeed}
							className="!bg-transparent !border-textSecondary/20 !text-textSecondary !w-full pr-10"
						/>
						<span className="absolute right-10 top-[72%] -translate-y-1/2 text-textSecondary text-sm pointer-events-none">
							km/h
						</span>
					</div>
					<div className="relative w-full">
						<Select
							{...register("windDirection")}
							name="windDirection"
							label="Wind Direction"
							items={windDirection}
							className="!bg-transparent !border-textSecondary/20 !text-textSecondary !w-full pr-10"
						/>
					</div>
				</div>
				<div className="flex gap-6">
					<div className="relative flex flex-col gap-3 w-full">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark">
							Beaufort Scale
						</label>
						<Input
							{...register("beaufortScale", { valueAsNumber: true })}
							type="number"
							placeholder="Enter Beaufort Scale"
							className="!bg-transparent !border-textSecondary/20 !h-[42px] sm:!h-[56px] !w-full"
						/>
					</div>
					<div className="relative flex flex-col gap-3 w-full">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark">
							Humidity
						</label>
						<Input
							{...register("humidity")}
							placeholder="Enter Humidity"
							className="!bg-transparent !border-textSecondary/20 !w-full"
						/>
					</div>
				</div>
				<div className="flex items-center gap-6 w-full">
					<div className="relative w-full ">
						<Select
							{...register("dewPoint")}
							name="dewPoint"
							label="Dew Point"
							items={highTemperatureOptions}
							className="!bg-transparent !h-[42px] sm:!h-[56px] !border-textSecondary/20 !text-textSecondary !w-full pr-10"
						/>
						<span className="absolute right-10 top-[72%] -translate-y-1/2 text-textSecondary text-sm pointer-events-none">
							°C
						</span>
					</div>
					<div className="relative flex flex-col gap-3 w-full">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark">
							Comfort Index
						</label>
						<Input
							{...register("comfortIndex", { valueAsNumber: true })}
							type="number"
							placeholder="Enter Comfort Index"
							className="!bg-transparent !border-textSecondary/20 !h-[42px] sm:!h-[56px] !w-full"
						/>
					</div>
				</div>
				<div className="flex items-center gap-6 w-full">
					<div className="relative w-full ">
						<Select
							{...register("barometricPressure")}
							name="barometricPressure"
							label="Barometric Pressure"
							items={barometricPressure}
							className="!bg-transparent !h-[42px] sm:!h-[56px] !border-textSecondary/20 !text-textSecondary !w-full pr-10"
						/>
						<span className="absolute right-10 top-[72%] -translate-y-1/2 text-textSecondary text-sm pointer-events-none">
							Hg
						</span>
					</div>
					<div className="relative flex flex-col gap-3 w-full">
						<label className="text-xs sm:text-base font-medium text-text dark:text-textDark">
							Cloud Cover (%)
						</label>
						<Input
							{...register("cloudCover")}
							type="text"
							placeholder="Enter Cloud Cover (%)"
							className="!bg-transparent !border-textSecondary/20 !h-[42px] sm:!h-[56px] !w-full"
						/>
					</div>
				</div>
			</div>
		),
		"Sun & Moon": (
			<div className="flex flex-col gap-6">
				<div className="flex gap-6 w-full">
					<TimePicker name="sunrise" label="Sunrise" register={register} setValue={setValue}
						getValues={getValues} />
					<TimePicker name="sunset" label="Sunset" register={register} setValue={setValue}
						getValues={getValues} />
				</div>
				<div className="flex gap-6 w-full">
					<TimePicker name="moonrise" label="Moonrise" register={register} setValue={setValue}
						getValues={getValues} />
					<TimePicker name="moonset" label="Moonset" register={register} setValue={setValue}
						getValues={getValues} />
				</div>
				<div className="relative w-full">
					<Select
						{...register("moonPhase")}
						name="moonPhase"
						label="Moon Phase"
						items={moonPhases}
						className="!bg-transparent !border-textSecondary/20 !w-full pr-10"
					/>
				</div>
			</div>
		),
		Precipitation: (
			<div className="relative flex flex-col gap-3 w-full">
				<label htmlFor="" className="text-xs sm:text-base font-medium text-text dark:text-textDark">
					Precipitation Probability
				</label>
				<Input
					{...register("precipitationProbability")}
					placeholder="Enter Precipitation Probability"
					className="!bg-transparent !border-textSecondary/20 !w-full"
				/>
			</div>
		),
	};


	return (
		<Modal
			openModal={isOpen}
			setOpenModal={() => setIsOpen(false)}
			size="760"
		>
			<div className="">
				<Dialog.Title className="text-base sm:text-2xl font-semibold text-text dark:text-textDark leading-[16px] sm:leading-[24px] mb-4 sm:mb-4">
					{editIndex !== null ? "Edit Weather Condition" : "Add Weather Condition"}
				</Dialog.Title>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
					<AccordionItem
						title="Location & Time"
						isOpen={openSections.includes("Location & Time")}
						onToggle={() => toggleSection("Location & Time")}
					>
						<div className="flex flex-col gap-6 sm:gap-6 w-full">
							{/* Location input with icon */}
							<div className="relative flex flex-col gap-3 w-full">
								<label htmlFor="" className="text-xs sm:text-base text-text dark:text-textDark">
									Location
								</label>
								<Input
									{...register("location")}
									disabled={mode === "view"}
									placeholder="Enter Location"
									className="!bg-transparent !border-textSecondary/20 !w-full"
								/>
								<Icon
									icon="location"
									className="absolute right-3 top-1/2 transform translate-y-1 w-5 h-5 text-textTurnery"
								/>
							</div>

							{/* City dropdown */}
							<div className="flex flex-col sm:flex-row items-center w-full gap-6">
								<div className="w-full">
									<Select
										label="City"
										disabled={mode === "view"}
										items={[{ value: "NY", text: "New York" }, { value: "LDN", text: "London" }]}
										className="!bg-transparent !border-textSecondary/20 !w-full"
										{...register("city")}
									/>
								</div>
								{/* Zip Code dropdown */}
								<div className="relative flex flex-col gap-3 w-full">
									<label htmlFor="" className="text-xs sm:text-sm font-medium text-text dark:text-textDark">
										Zip Code
									</label>
									<Input
										{...register("zipCode")}
										placeholder="Enter Zip Code"
										disabled={mode === "view"}
										className="!bg-transparent h-[48px] !border-textSecondary/20 !w-full"
									/>
									<Icon
										icon="location"
										className="absolute right-3 top-1/2 transform translate-y-1 w-5 h-5 text-textTurnery"
									/>
								</div>
							</div>
							{/* Effective From (start/end date) */}
							<div className="flex flex-col sm:flex-row w-full gap-6">
								<div className="flex flex-col gap-3">
									<label className="text-xs sm:text-sm font-medium text-text dark:text-textDark">Effective From</label>
									<div className="flex gap-3">
										<input {...register("effectiveFrom.startDate")} type="date" disabled={mode === "view"} className="w-full sm:h-14 text-textSecondary border border-textSecondary/20 rounded-xl px-3 py-2" />
										<input {...register("effectiveFrom.endDate")} type="date" disabled={mode === "view"} className="w-full sm:h-14 text-textSecondary border border-textSecondary/20 rounded-xl px-3 py-2" />
									</div>
								</div>

								{/* Time Range */}
								<div className="flex flex-col gap-3 w-full">
									<label className="text-xs sm:text-sm font-medium text-text dark:text-textDark">Time Range</label>
									<div className="flex gap-3 w-full">
										<TimePicker name="timeRange.startTime" register={register} setValue={setValue}
											getValues={getValues} />
										<TimePicker name="timeRange.endTime" register={register} setValue={setValue}
											getValues={getValues} />
									</div>
								</div>
							</div>
						</div>
					</AccordionItem>

					{/* Accordion: Other Sections */}
					{["Temperature", "Wind & Atmosphere", "Sun & Moon", "Precipitation"].map(section => (
						<AccordionItem
							key={section}
							title={section}
							isOpen={openSections.includes(section)}
							onToggle={() => toggleSection(section)}
						>
							{accordionContent[section]}
						</AccordionItem>
					))}
					<div className="flex justify-end gap-4 mt-0 sm:mt-2">
						<Button
							type="button"
							className="text-sm sm:text-base w-full sm:w-[127px] px-6 !py-[10.3px] sm:!py-[15.1px] border border-text dark:border-bgc rounded-xl font-semibold text-text dark:text-textDark bg-transparent hover:!bg-transparent"
							onClick={() => setIsOpen(false)}>
							Cancel
						</Button>
						{mode !== "view" && (
							<Button
								type="submit"
								className="text-sm sm:text-base w-full sm:w-auto px-6 !py-[10.3px] sm:!py-[15.1px] bg-primary rounded-xl font-semibold text-text">
								{editIndex === null ? "Add Override" : "save"}
							</Button>
						)}
					</div>
				</form>
			</div>

		</Modal>
	);
};

export default AddEditWeatherPopup;
