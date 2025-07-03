import { Button } from "@headlessui/react";
import Modal from "components/layout/modal";
import React from "react";

type ResetConfirmationPopupProps = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	onConfirm: () => void;
};

const ResetConfirmation: React.FC<ResetConfirmationPopupProps> = ({ isOpen, setIsOpen, onConfirm }) => {
	return (
		<Modal openModal={isOpen} setOpenModal={setIsOpen} size="md">
			<div className="text-center flex flex-col items-center gap-4 sm:gap-8">
				<h2 className="text-base sm:text-2xl font-semibold self-start text-text dark:text-textDark">
					Reset Confirmation
				</h2>
				<div className="flex flex-col items-center w-full gap-2 sm:gap-3">
					<p className="text-base sm:text-xl font-medium text-text dark:text-textDark">
						Are you sure you want to reset this?
					</p>
					<p className="text-sm sm:text-base text-textSecondary dark:text-textDark">
						This will clear your current dropdown choice and leave the field unselected.
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
							onConfirm();
							setIsOpen(false);
						}}
					>
						Yes, Reset
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ResetConfirmation;

