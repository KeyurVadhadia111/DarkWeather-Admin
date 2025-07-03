import Icon from "./Icon";

interface SelectProps {
	name: string;
	label?: string;
	required?: boolean;
	error?: string;
	className?: string;
	items: { value: any; text: string, disabled?: boolean }[];
	register?: any;
	trigger?: (name: any) => void;
	placeholder?: string;
	value?: string | number;
	onChange?: (value: any) => void;
}

const Select = ({ name, label, required, error, className, items, register, trigger, placeholder, value, onChange }: SelectProps) => {
	return (
		<div className="relative">
			{label && (
				<label
					htmlFor={name}
					className="text-xs sm:text-base font-medium text-text dark:text-textDark leading-[18px] sm:leading-[21px] mb-2 sm:mb-3 block">
					{label} {required && <span className="text-red-500">*</span>}
				</label>
			)}
			<div className="relative">
				<select
					name={name}
					value={value}
					onChange={(e) => {
						const val = e.target.value;
						onChange?.(val);
						if (register) {
							trigger?.(name);
						}
					}}
					className={`appearance-none block px-4 w-full h-12 rounded-lg text-base bg-white text-gray-500 dark:bg-gray-800 border border-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFA500] dark:border-gray-700 dark:text-gray-300 ${className || ""} ${error ? "!border-red-500 focus-visible:!ring-red-500" : ""
						}`}
					{...(register &&
						register(name, {
							onChange: () => {
								trigger && trigger(name);
							},
						}))}>
					{label && <option value="">{placeholder || `Select ${label}`}</option>}
					{items?.map(item => (
						<option value={item.value} key={item.value} disabled={item.disabled}>
							{item.text}
						</option>
					))}
				</select>

				<div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
					<Icon icon="chevron-down" className="w-5 h-5 text-gray-400" />
				</div>
			</div>
			{error && <div className="text-red-500 text-sm mt-1">{error}</div>}
		</div>
	);
};

export default Select;
