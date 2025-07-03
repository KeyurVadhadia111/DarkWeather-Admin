import { Button } from "@headlessui/react";
import Modal from "components/layout/modal";
import React from "react";

type ScheduleConfirmationPopupProps = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	onConfirm: () => void;
	itemType: string;
};

const ScheduleConfirmation: React.FC<ScheduleConfirmationPopupProps> = ({ isOpen, setIsOpen, onConfirm, itemType }) => {
	return (
		<Modal openModal={isOpen} setOpenModal={setIsOpen} size="md">
			<div className="text-center flex flex-col items-center gap-4 sm:gap-8">
				<h2 className="text-base sm:text-2xl font-semibold self-start text-text dark:text-textDark">
					Schedule Confirmation
				</h2>
				<img src="/assets/images/Schedule-1.svg" alt="" className="w-16 sm:w-[127px] h-auto" />

				<div className="flex flex-col items-center w-full gap-2 sm:gap-3">
					<p className="text-base sm:text-xl font-medium text-text dark:text-textDark">
						Are you sure you want to schedule this article for the future?
					</p>
					<p className="text-sm sm:text-base text-textSecondary dark:text-textDark">
						This article will be automatically triggered on
					</p>
				</div>

				<div className="mt-2 sm:mt-0 flex justify-end w-full gap-3 sm:gap-6">
					<Button
						className="!w-full sm:!w-auto border border-text dark:border-bgc text-sm sm:text-base text-text dark:text-textDark !px-6 !py-3 sm:!px-6 sm:!py-4 !rounded-xl !font-semibold"
						onClick={() => setIsOpen(false)}
					>
						Cancel
					</Button>
					<Button
						className="!w-full sm:!w-auto bg-primary text-sm sm:text-base text-text !px-6 !py-3 sm:!px-6 sm:!py-4 !rounded-xl !font-semibold"
						onClick={() => {
							setIsOpen(false);
							onConfirm();
						}}
					>
						Save
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ScheduleConfirmation;

