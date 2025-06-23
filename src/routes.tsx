import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import useAppState from "components/utils/useAppState";
import Login from "pages/Login";
import App from "pages/App";
import AccessDisabled from "pages/AccessDisabled";
import ForgotPasswordPage from "pages/ForgotPasswordPage";
import Dashboard from "pages/Dashboard";
import UserManagementPage from "pages/UserManagementPage";
import OverrideWeatherInfoPage from "pages/OverrideWeatherInfoPage";
import ActivityLogPage from "pages/ActivityLogPage";
import WeatherAlertPage from "pages/WeatherAlertPage";
import RoleManagement from "pages/RoleManagement";

declare global {
	interface Window {
		maintenance: boolean;
	}
}
const queryClient = new QueryClient();

const reducer = (state: any, action = {}) => {
	return {
		...state,
		...action,
	};
};
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const location = useLocation();
	const userDetails = useAppState(state => state.userDetails);
	const setUserDetails = useAppState(state => state.setUserDetails);
	const user = JSON.parse(localStorage.getItem("auth") || "{}");

	const isAuthPage = location.pathname === "/login" || location.pathname === "/forgot-password";

	if (location.pathname === "/") {
		return <>{children}</>;
	}
	if (user?._id) {
		// User is logged in, block access to login
		if (isAuthPage) {
			return <Navigate to="/" replace />;
		}
		// Allow access to other routes
		return <>{children}</>;
	} else {
		// Not logged in, allow access only to login
		if (isAuthPage) {
			return <>{children}</>;
		}
		setUserDetails({});
		// Redirect to login for protected routes
		return <Navigate to="/login" replace />;
	}
};

const createRoutes: React.FC = () => {
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path="/" element={<App />}>
						{/* Default route redirecting to /pricing */}
						{/* <Route index element={<Navigate to="/pricing" replace />} /> */}
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<Login />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/forgot-password"
							element={
								<ProtectedRoute>
									<ForgotPasswordPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/user-management"
							element={
								<ProtectedRoute>
									<UserManagementPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/override-weather-info"
							element={
								<ProtectedRoute>
									<OverrideWeatherInfoPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/weather-alert"
							element={
								<ProtectedRoute>
									<WeatherAlertPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/role"
							element={
								<ProtectedRoute>
									<RoleManagement />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/activity-log"
							element={
								<ProtectedRoute>
									<ActivityLogPage />
								</ProtectedRoute>
							}
						/>
						<Route path="access_disabled" element={<AccessDisabled />} />
						<Route path="*" element={<Navigate to="/" />} />
					</Route>
				</Routes>
			</QueryClientProvider>
		</BrowserRouter>
	);
};

export default createRoutes;
