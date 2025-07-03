// components/JoditEditor.tsx
import React, { useRef } from "react";
import JoditEditor from "jodit-react";

type CustomCSSProps = React.CSSProperties & {
	[key: `--${string}`]: string;
};

type Props = {
	value: string;
	onChange: (val: string) => void;
	customClass?: string;
	styleOverrides?: CustomCSSProps;
};

const Editor: React.FC<Props> = ({ value, onChange, customClass = "", styleOverrides = {} }) => {
	const editor = useRef(null);

	const config = {
		readonly: false,
		toolbar: true,
		spellcheck: true,
		statusbar: false,
		language: "en",
		toolbarAdaptive: false,
		showCharsCounter: true,
		showWordsCounter: true,
		showXPathInStatusbar: false,
		askBeforePasteHTML: true,
		askBeforePasteFromWord: true,
		placeholder: "Enter Title",
		buttons: [
			"bold",
			"italic",
			"underline",
			"brush",
			"left",
			"center",
			"right",
			"ul",
			"ol"
		],
	};

	return (
		<div className={customClass} style={styleOverrides}>
			<JoditEditor
				ref={editor}
				value={value}
				config={config}
				onBlur={(newContent) => onChange(newContent)}
			/>
		</div>
	);
};

export default Editor;
