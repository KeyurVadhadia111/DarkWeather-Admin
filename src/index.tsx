import { createRoot } from "react-dom/client";
import createRoutes from "routes";
import "./main.css";

declare global {
	interface Window {
		globalCustID?: string | null;
	}
	interface Request {
		duplex: string;
	}
}

// Extract the query param from the URL
const params = new URLSearchParams(window.location.search);
const queryParamValue = params.get("store");
// If query param is present, add it to local storage and remove it from the URL
if (queryParamValue) {
	localStorage.setItem("lufinaURL", queryParamValue);
}

let container: HTMLDivElement;

window.globalCustID = "";
const routes = createRoutes({ someProp: "value" }); // Replace with actual arguments required by createRoutes
document.addEventListener("DOMContentLoaded", function () {
	if (!container) {
		container = document.getElementById("root") as HTMLDivElement;
		const root = createRoot(container);
		root.render(routes);
	}
});
