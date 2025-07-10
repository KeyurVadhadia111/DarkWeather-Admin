import { Listbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import Icon from 'components/utils/Icon';

interface Option {
	value: string;
	text: string;
	icon: string;
}

interface SelectWithImagesProps {
	label?: string;
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	required?: boolean;
	error?: string;
}

export default function SelectWithImages({
	label,
	options,
	value,
	onChange,
	required,
	error
}: SelectWithImagesProps) {
	const selectedOption = options.find(opt => opt.value === value);

	return (
		<div className="w-full">
			{label && (
				<label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
					{label} {required && <span className="text-red-500">*</span>}
				</label>
			)}
			<Listbox value={value} onChange={onChange}>
				<div className="relative">
					<Listbox.Button className="relative w-full cursor-default rounded-lg bg-bgc dark:bg-fgcDark border border-border dark:border-borderDark py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
						<img src={selectedOption?.icon} alt={selectedOption?.text} className={`w-[110px] h-[38px] object-contain outline-none focus:outline-none ${selectedOption ? "dark:bg-white px-3 py-1.1.5 rounded-lg" : ""}`} />
						{/* {selectedOption?.text} */}
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<Icon icon='chevron-down' className="h-5 w-5 text-gray-400" aria-hidden="true" />
						</span>
					</Listbox.Button>

					<Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-bgcDark py-1 text-base focus:outline-none sm:text-sm">
						{options.map((option) => (
							<Listbox.Option
								key={option.value}
								className={({ active }) =>
									`relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'text-text dark:text-textDark' : 'text-text dark:text-textDark '
									}`
								}
								value={option.value}
							>
								{({ selected }) => (
									<>
										<span className="flex items-center gap-2">
											<img src={option.icon} alt={option.text} className="w-5 h-5 object-contain" />
											{option.text}
										</span>
										{selected && (
											<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
												<CheckIcon className="h-5 w-5" aria-hidden="true" />
											</span>
										)}
									</>
								)}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</div>
			</Listbox>
			{error && <div className="text-red-500 text-sm mt-1">{error}</div>}
		</div>
	);
}
