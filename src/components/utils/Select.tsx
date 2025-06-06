import Icon from "./Icon";

const Select = (props: any) => {
	return (
		<div className="relative">
			{props.label && (
				<label
					htmlFor={props.name}
					className="text-sm font-medium text-textSecondary dark:text-textDark mb-3 block">
					{props.label} {props.required && <span className="text-red-500">*</span>}
				</label>
			)}
			<div className="relative">
				<select
					name={props.name}
					className={`appearance-none block px-3 py-3 sm:px-4 sm:py-[15px] w-full rounded-xl text-[14px] bg-bgc text-text dark:bg-fgcDark border border-textSecondary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-border-dark dark:border-border-dark-dark sm:text-base dark:text-white ${props.className || ""}  ${
						props.error
							? "!border !border-red-500 focus-visible:!ring-red-500"
							: "focus-visible:ring-neutral-300"
					}`}
					{...(props.register &&
						props.register(props.name, {
							onChange: (e: any) => {
								props.trigger && props.trigger(props.name);
							},
						}))}>
					{props.label === "Choose a topic" ? (
						<option value="">{props.label}</option>
					) : (
						<option value="">Select {props.label}</option>
					)}
					{props.items &&
						props.items.map((item: any) => (
							<option value={item.value} key={item.value}>
								{item.text}
							</option>
						))}
				</select>

				{/* Custom dropdown arrow */}
				<div
					className={`pointer-events-none absolute right-4 ${props.error ? "top-[35%]" : "top-1/2"}  -translate-y-1/2`}>
					<Icon icon="arrow-down" className="w-4 h-4 sm:w-5 sm:h-5 text-textSecondary dark:text-textDark" />
				</div>

				{props.error && <div className="text-red-500 px-5 inline-block">{props.error}</div>}
			</div>
		</div>
	);
};

export default Select;
