import { Button } from "components/utils/Button";
import { Input } from "components/utils/Input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toast } from "components/utils/toast";
import Icon from "components/utils/Icon";

interface SlackType {
	healthConditions: string[];
	outdoorActivities: string[];
}

const schema = yup.object({
	healthConditions: yup
		.array()
		.of(yup.string())
		.min(1, "Select at least one health condition"),
	outdoorActivities: yup
		.array()
		.of(yup.string())
		.min(1, "Select at least one outdoor activity"),
});

const ActivitiesConfiguration = () => {

	const [healthConditionOptions, setHealthConditionOptions] = useState([
		"Allergy (Pollen)",
		"Asthma",
		"Archerites",
		"Migraine",
		"Cardiac Issues (Heat Risk)",
	]);

	const [outdoorActivityOptions, setOutdoorActivityOptions] = useState([
		"Jogging / Running",
		"Cycling",
		"Hiking / Trekking",
		"Outdoor Work",
		"Migraine",
		"Cardiac Issues (Heat Risk)",
	]);

	const [showHealthInput, setShowHealthInput] = useState(false);
	const [showOutdoorInput, setShowOutdoorInput] = useState(false);

	const [newHealthItem, setNewHealthItem] = useState("");
	const [newOutdoorItem, setNewOutdoorItem] = useState("");

	const handleHealthKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const value = newHealthItem.trim();

			if (!value) return;

			if (healthConditionOptions.includes(value)) {
				toast.error("This entry already exists.");
				return;
			}

			setHealthConditionOptions([...healthConditionOptions, value]);
			setNewHealthItem("");
			setShowHealthInput(false);
		}
	};


	const handleOutdoorKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const value = newOutdoorItem.trim();

			if (!value) return;

			if (outdoorActivityOptions.includes(value)) {
				toast.error("This entry already exists.");
				return;
			}

			setOutdoorActivityOptions([...outdoorActivityOptions, value]);
			setNewOutdoorItem("");
			setShowOutdoorInput(false);
		}
	};



	const {
		handleSubmit,
		register,
		control,
		trigger,
		reset,
		formState: { errors },
	} = useForm<SlackType>({
		defaultValues: {
			healthConditions: [],
			outdoorActivities: [],
		},
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: any) => {
		console.log("Submitted Data:", data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="flex flex-col w-full gap-4 p-3 sm:p-4 relative bg-bgc dark:bg-fgcDark border border-border dark:border-borderDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				<span className="text-xl text-text dark:text-white font-medium">Health Conditions & Activities Configuration</span>

				<div className="flex flex-col sm:gap-4 gap-3 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">

					{/* User Health Conditions */}
					<div className="flex flex-col lg:flex-row justify-between gap-4 w-full">
						<div className="flex flex-col items-start gap-4 w-full">
							<span className="text-base text-text dark:text-white font-medium">User Health Conditions</span>
							<div className="flex flex-col md:flex-row flex-wrap gap-2.5 md:gap-6 w-full">
								{healthConditionOptions.map((item) => (
									<label key={item} className="group relative flex items-center gap-3 text-sm text-textSecondary dark:text-white cursor-pointer hover:bg-white px-3 py-2.5 hover:rounded-lg">
										<div className="absolute -top-1 -right-1 bg-text p-0.5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
											onClick={(e) => {
												e.stopPropagation();
												setHealthConditionOptions((prev) => prev.filter((val) => val !== item));
											}}
										>
											<Icon icon="close" className="w-2 h-2 text-white" />
										</div>
										<input
											type="checkbox"
											value={item}
											{...register("healthConditions")}
											className="peer hidden"
										/>
										<span className="w-4 h-4 rounded-md border border-[#808080] dark:border-white flex items-center justify-center peer-checked:bg-[#FFA500] peer-checked:border-[#FFA500]" />
										<svg
											className="w-3 h-3 text-black absolute left-3.5 opacity-0 peer-checked:opacity-100 transition-opacity duration-150 pointer-events-none"
											fill="none"
											stroke="currentColor"
											strokeWidth="3"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
										</svg>
										{item}
									</label>
								))}
							</div>
							{errors.healthConditions && <p className="text-sm text-red-500">{errors.healthConditions.message}</p>}
						</div>
						<div className="flex items-center gap-3">
							{showHealthInput ? (
								<Input
									value={newHealthItem}
									onChange={(e) => setNewHealthItem(e.target.value)}
									onKeyDown={handleHealthKeyPress}
									placeholder="New Health Condition"
									className="bg-white !w-full"
								/>
							) : (
								<div
									onClick={() => setShowHealthInput(true)}
									className="rounded-lg cursor-pointer text-sm font-medium whitespace-nowrap text-primary"
								>
									+ Add
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col sm:gap-4 gap-3 w-full rounded-xl bg-[#F8F8F8] dark:bg-bgcDark p-4">

					{/* Outdoor Activities */}
					<div className="flex flex-col lg:flex-row justify-between gap-4 w-full">
						<div className="flex flex-col items-start gap-4 w-full">
							<span className="text-base text-text dark:text-white font-medium">Outdoor Activities</span>
							<div className="flex flex-col md:flex-row flex-wrap gap-2.5 md:gap-6 w-full">
								{outdoorActivityOptions.map((item) => (
									<label
										key={item}
										className="group relative flex items-center gap-3 text-sm text-textSecondary dark:text-white cursor-pointer hover:bg-white px-3 py-2.5 hover:rounded-lg"
									>
										{/* Close Icon */}
										<div
											className="absolute top-0 right-0 bg-text p-0.5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
											onClick={(e) => {
												e.stopPropagation();
												setOutdoorActivityOptions((prev) => prev.filter((val) => val !== item));
											}}
										>
											<Icon icon="close" className="w-2 h-2 text-white" />
										</div>

										<input
											type="checkbox"
											value={item}
											{...register("outdoorActivities")}
											className="peer hidden"
										/>

										<span className="w-4 h-4 rounded-md border border-[#808080] dark:border-white flex items-center justify-center peer-checked:bg-[#FFA500] peer-checked:border-[#FFA500]" />

										<svg
											className="w-3 h-3 text-black absolute left-3.5 opacity-0 peer-checked:opacity-100 transition-opacity duration-150 pointer-events-none"
											fill="none"
											stroke="currentColor"
											strokeWidth="3"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
										</svg>

										{item}
									</label>
								))}

							</div>
							{errors.outdoorActivities && <p className="text-sm text-red-500">{errors.outdoorActivities.message}</p>}
						</div>
						<div className="flex items-center gap-3">
							{showOutdoorInput ? (
								<Input
									value={newOutdoorItem}
									onChange={(e) => setNewOutdoorItem(e.target.value)}
									onKeyDown={handleOutdoorKeyPress}
									placeholder="New Outdoor Activity"
									className="bg-white !w-full"
								/>
							) : (
								<div
									onClick={() => setShowOutdoorInput(true)}
									className="rounded-lg cursor-pointer text-sm font-medium whitespace-nowrap text-primary"
								>
									+ Add
								</div>
							)}
						</div>
					</div>

				</div>
			</div>
			{/* Buttons */}
			<div className="flex justify-end gap-3">
				<Button
					type="button"
					className="text-sm sm:text-base w-auto px-6 !py-[10.3px] sm:!py-[15.1px] border border-text dark:border-bgc rounded-xl font-semibold text-text dark:text-textDark bg-transparent hover:!bg-transparent"
					onClick={() => reset()}
				>
					Reset
				</Button>
				<Button
					type="submit"
					className="text-sm sm:text-base w-auto px-6 !py-[10.3px] sm:!py-[15.1px] bg-primary rounded-xl font-semibold text-text"
				>
					Save
				</Button>
			</div>
		</form>
	);

}

export default ActivitiesConfiguration;
