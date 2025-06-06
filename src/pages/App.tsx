import Footer from "components/layout/Footer";
import Header from "components/layout/Header";
import { Outlet, useLocation } from "react-router-dom";
import "swiper/css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastIcons } from "components/utils/toast-icons";
import { useAppState } from "components/utils/useAppState";
import "simplebar-react/dist/simplebar.min.css";

function App() {
	const [{ premiumStep }, setAppState] = useAppState();

	const location = useLocation();
	const isAuthPage =
		location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password";

	return (
		<div className="bg-bgc dark:bg-bgcDark flex flex-row justify-center w-full">
			<div className="overflow-hidden w-full h-full min-h-screen">
				<div className="flex flex-col w-full items-end relative">
					<div
						className={`absolute  w-full h-[785px] sm:h-[818px] top-0 left-auto overflow-visible bg-no-repeat bg-position-[center_top] bg-[length:360%] sm:bg-[length:120%] bg-[url('/assets/images/bg/bg-header.png')]`}
					/>
					<div
						className={`absolute inset-0 bg-gradient-to-b from-bgc/0  to-bgc dark:from-bgcDark/70 dark:to-bgcDark h-[785px] sm:h-[818px]`}
					/>

					{/* Header Navigation */}
					{/* {location.pathname !== "/weather-ai" ? <Header /> : ""} */}

					{/* Main Content */}
					<main
						className={`z-[1] relative w-full ${location.pathname !== "/weather-ai" && "min-h-[calc(100vh-470px)]"}`}>
						<Outlet />
					</main>

					{/* Footer Section */}
					{/* {location.pathname !== "/weather-ai" ? <Footer /> : ""} */}
					<ToastContainer toastClassName={"!rounded-2xl"} icon={({ type }) => ToastIcons[type as keyof typeof ToastIcons]?.() || null} />
				</div>
			</div>
		</div>
	);
}

export default App;
