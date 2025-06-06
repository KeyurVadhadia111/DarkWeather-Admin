import * as React from "react";
import { cn } from "lib/utils";
import Icon from "./Icon";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
	return (
		<label className="inline-flex items-center relative">
			<input
				type="checkbox"
				ref={ref}
				className={cn(
					"peer appearance-none shrink-0 border border-neutral-400 focus:ring-0 focus-visible:outline-none focus:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 !bg-none focus:ring-transparent checked:border-primary w-5 h-5 rounded-[5px] checked:!bg-primary",
					className,
				)}
				{...props}
			/>
			<span className="pointer-events-none absolute flex h-4 w-4 items-center justify-center text-textDark dark:text-text peer-checked:visible invisible peer-disabled:opacity-50 left-0.5">
				<Icon icon="check" className="h-4 w-4 pt-0.5" strokeWidth={3} />
			</span>
		</label>
	);
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
