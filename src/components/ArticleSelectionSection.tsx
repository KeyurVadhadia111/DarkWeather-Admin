import React from "react";
import Select from "components/utils/Select";
import { Button } from "components/utils/Button";
import ResetConfirmation from "./popup/ResetConfirmation";

type Props = {
	title: string;
	sectionKey: "top" | "severe";
	articleSelections: Record<string, string | number | null>;
	getFilteredOptions: (articleKey: string, sectionKey: "top" | "severe") => any[];
	handleSelectChange: (name: any, value: number, section: 'top' | 'severe') => void;
	onReset?: () => void;
	onSave?: () => void;
	errors?: Record<string, { message?: string }>;

};

const ArticleSelectionSection: React.FC<Props> = ({
	title,
	sectionKey,
	articleSelections,
	getFilteredOptions,
	handleSelectChange,
	onReset,
	onSave,
	errors
}) => {
	const [showResetConfirm, setShowResetConfirm] = React.useState(false);

	const handleConfirmReset = () => {
		setShowResetConfirm(false);
		onReset?.();
	};



	return (
		<div className="w-full lg:w-1/2 relative bg-bgc dark:bg-bgcDark rounded-2xl p-4 shadow-[0px_10px_65px_#0000000d]">
			<div className="flex flex-col gap-4">
				<span className="font-medium sm:text-xl text-text dark:text-textDark">{title}</span>
				<div className="grid grid-cols-1 min-[1310px]:lg:grid-cols-2 gap-4">
					{[...Array(7)].map((_, idx) => {
						const articleKey = `article${idx + 1}`;
						return (
							<div className="col-span-1" key={articleKey}>
								<Select
									name={articleKey}
									label={`Article ${idx + 1}`}
									required
									className="!bg-bgc dark:!bg-fgcDark !border-textSecondary/20 !h-[42px] sm:!h-14 !rounded-xl !text-sm sm:!text-base"
									items={getFilteredOptions(articleKey, sectionKey)}
									value={articleSelections[articleKey] ?? ""}
									onChange={(val: any) => handleSelectChange(articleKey, Number(val), sectionKey)}
									error={errors?.[articleKey]?.message}
								/>
							</div>
						);
					})}
					<div className="col-span-1 flex justify-end">
						<div className="flex gap-4 items-end">
							<Button
								type="button"
								className="text-sm sm:text-base w-full sm:w-auto px-6 !py-[10.3px] sm:!py-[15.1px] border border-text dark:border-bgc rounded-xl font-semibold text-text dark:text-textDark bg-transparent hover:!bg-transparent"
								onClick={() => setShowResetConfirm(true)}
							>
								Reset
							</Button>
							<Button
								type="submit"
								className="text-sm sm:text-base w-full sm:w-auto px-6 !py-[10.3px] sm:!py-[15.1px] bg-primary rounded-xl font-semibold text-text"
								onClick={onSave}
							>
								Save
							</Button>
						</div>
					</div>
				</div>
			</div>
			<ResetConfirmation
				isOpen={showResetConfirm}
				setIsOpen={setShowResetConfirm}
				onConfirm={handleConfirmReset}
			/>
		</div>
	);
};

export default ArticleSelectionSection;
