import { Outlet, useLocation } from "react-router-dom";
import Header from "components/layout/Header";
import "swiper/css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastIcons } from "components/utils/toast-icons";
import useAppState from "components/utils/useAppState";
import "simplebar-react/dist/simplebar.min.css";
import Sidebar from "components/layout/Sidebar";

function App() {
	const isSideExpanded = useAppState(state => state.isSideExpanded);
	const location = useLocation();

	return (
		<div className="bg-fgc dark:bg-bgcDark flex flex-row justify-center w-full">
			<div className="overflow-hidden w-full h-full min-h-screen">
				<div className="flex flex-col w-full items-end relative">
					<div
						className={`absolute  w-full h-[785px] sm:h-[818px] top-0 left-auto overflow-visible bg-no-repeat bg-position-[center_top] bg-[length:360%] sm:bg-[length:120%] bg-[url('/assets/images/bg/bg-header.png')]`}
					/>
					<div
						className={`absolute inset-0 bg-gradient-to-b from-bgc/0  to-bgc dark:from-bgcDark/70 dark:to-bgcDark h-[785px] sm:h-[818px]`}
					/>

					{/* Header Navigation */}

					{/* Main Content */}
					<main
						className={`w-full flex ${
							location.pathname !== "/" && location.pathname !== "/forgot-password" ? "p-0 sm:p-4" : ""
						}`}>
						{location.pathname !== "/" && location.pathname !== "/forgot-password" ? <Sidebar /> : ""}
						<div className="flex flex-col w-full relative pl-0 sm:pl-4">
							{location.pathname !== "/" && location.pathname !== "/forgot-password" ? (
								<div
									className={`${isSideExpanded ? "sm:w-[calc(100vw-385px)]" : "sm:w-[calc(100vw-163px)]"}`}>
									<Header />
								</div>
							) : (
								""
							)}
							<div
								className={` ${
									location.pathname !== "/" && location.pathname !== "/forgot-password"
										? "sm:p-0 p-6"
										: ""
								} ${isSideExpanded ? " sm:w-[calc(100vw-385px)]" : "sm:w-[calc(100vw-163px)]"}}`}>
								<Outlet />
							</div>
						</div>
					</main>

					{/* Footer Section */}
					{/* {location.pathname !== "/weather-ai" ? <Footer /> : ""} */}
					<ToastContainer
						toastClassName={"!rounded-2xl"}
						icon={({ type }) => ToastIcons[type as keyof typeof ToastIcons]?.() || null}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
