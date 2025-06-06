import { cn } from "lib/utils";
import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: "horizontal" | "vertical";
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
	({ className, orientation = "horizontal", ...props }, ref) => {
		return (
			<div
				ref={ref}
				role="separator"
				aria-orientation={orientation}
				className={cn(
					"shrink-0 bg-gradient-to-l from-textSecondary/30 dark:from-textSecondary to-transparent",
					orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
					className,
				)}
				{...props}
			/>
		);
	},
);

Separator.displayName = "Separator";

export { Separator };
