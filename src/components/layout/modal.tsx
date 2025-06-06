import { Dialog, Transition } from "@headlessui/react";
import { classNames } from "components/utils";
import { useAppState } from "components/utils/useAppState";
import React, { Fragment, JSX, useRef } from "react";

type ModalSizeType = {
	[key: string]: string;
};
const ModalSize: ModalSizeType = {
	xs: "lg:w-3/12 sm:w-6/12 md:w-5/12",
	sm: "w-full sm:w-4/12",
	md: "w-full lg:w-5/12 sm:w-10/12 md:w-8/12",
	lg: "lg:w-7/12 sm:w-10/12 md:w-10/12",
	lx: "w-full sm:w-[1170px] ",
	xl: "lg:w-8/12 sm:w-10/12 md:w-10/12",
};

type RequestType = {
	openModal: boolean;
	setOpenModal: (fl: boolean) => void;
	size: string;
	children: JSX.Element;
	className?: string;
};

const Modal: React.FC<RequestType> = ({ openModal, setOpenModal, size, children, className }) => {
	const cancelButtonRef = useRef(null);
	const [{ isDark }] = useAppState();
	return (
		<>
			{size && (
				<Transition.Root show={openModal} as={Fragment}>
					<Dialog as="div" className="relative z-[100]" initialFocus={cancelButtonRef} onClose={setOpenModal}>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<div className="fixed inset-0 bg-black/50" />
						</Transition.Child>

						<div className="overflow-y-auto fixed inset-0">
							<div className="flex justify-center items-center w-full min-h-full text-center p-4">
								<Transition.Child
									as={Fragment}
									enter="ease-out duration-300"
									enterFrom="opacity-0 scale-95"
									enterTo="opacity-100 scale-100"
									leave="ease-in duration-200"
									leaveFrom="opacity-100 scale-100"
									leaveTo="opacity-0 scale-95">
									<Dialog.Panel
										className={classNames(
											"relative",
											`${ModalSize[size]}`,
											"overflow-hidden p-4 sm:p-8 text-left align-middle bg-bgc rounded-2xl sm:rounded-3xl shadow-xl transition-all transform dark:bg-fgcDark",
											className,
										)}>
										{children}
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition.Root>
			)}
		</>
	);
};

export default Modal;
