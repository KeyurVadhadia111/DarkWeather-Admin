import { Button } from "@headlessui/react";
import Modal from "components/layout/modal";
import React from "react";

type DeleteUserPopupProps = {
	isOpen: boolean;
	setIsOpen: (val: boolean) => void;
	user: IUser | null;
	onDelete: () => void;
	itemType: string;
};

const DeleteUserPopup: React.FC<DeleteUserPopupProps> = ({ isOpen, setIsOpen, onDelete, itemType }) => {
	return (
		<Modal openModal={isOpen} setOpenModal={setIsOpen} size="md">
			<div className="text-center flex flex-col items-center gap-4 sm:gap-8">
				<h2 className="text-base sm:text-2xl font-semibold self-start text-text dark:text-textDark">
					Delete {itemType}
				</h2>
				<img src="/assets/images/trash-2.svg" alt="" className="w-16 sm:w-[82px] h-auto" />

				<div className="flex flex-col items-center w-full gap-2 sm:gap-3">
					<p className="text-base sm:text-xl font-medium text-text dark:text-textDark">
						Are you sure you want to delete {itemType.toLowerCase()}?
					</p>
					<p className="text-sm sm:text-base text-textSecondary dark:text-textDark">
						Permanently remove this {itemType.toLowerCase()}. This action cannot be undone.
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
							onDelete();
							setIsOpen(false);
						}}
					>
						Delete {itemType}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default DeleteUserPopup;

