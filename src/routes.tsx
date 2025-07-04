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
import Subscription from "pages/Subscription";
import PostsArticlesPage from "pages/PostsArticlesPage";
import NotificationSystemPage from "pages/NotificationSystemPage";

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
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// 	const location = useLocation();
// 	let userDetails = useAppState(state => state.userDetails);
// 	const setUserDetails = useAppState(state => state.setUserDetails);
// 	if (!userDetails) {
// 		userDetails = JSON.parse(localStorage.getItem('auth') || '{}');
// 	}
// 	const isAuthPage = location.pathname === "/login" || location.pathname === "/forgot-password";
// 	console.log("userDetails", userDetails)
// 	if (location.pathname === "/") {
// 		return <>{children}</>;
// 	}
// 	if (userDetails.user_id) {
// 		console.log("userid")
// 		// User is logged in, block access to login
// 		if (isAuthPage) {
// 			console.log("userid & isAuthPage")
// 			return <Navigate to="/" replace />;
// 		}
// 		// Allow access to other routes
// 		return <>{children}</>;
// 	} else {
// 		console.log("else")
// 		// Not logged in, allow access only to login
// 		if (isAuthPage) {
// 			console.log("else & isAuthPage")
// 			return <>{children}</>;
// 		}
// 		setUserDetails({});
// 		// Redirect to login for protected routes
// 		return <Navigate to="/login" replace />;
// 	}
// };


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const location = useLocation();
	let userDetails = useAppState(state => state.userDetails);
	const setUserDetails = useAppState(state => state.setUserDetails);

	// If userDetails not in state, try to restore from localStorage
	if (!userDetails || !userDetails.user_id) {
		const localUserDetails = JSON.parse(localStorage.getItem('auth') || '{}');

		if (localUserDetails.user_id) {
			userDetails = localUserDetails;
			setUserDetails(localUserDetails); // this line ensures it gets stored in global state
		}
	}

	const isAuthPage = location.pathname === "/login" || location.pathname === "/forgot-password";

	if (location.pathname === "/") {
		return <>{children}</>;
	}

	if (userDetails && userDetails.user_id) {
		// Logged in user
		if (isAuthPage) {
			return <Navigate to="/dashboard" replace />;
		}
		return <>{children}</>;
	} else {
		// Not logged in
		if (isAuthPage) {
			return <>{children}</>;
		}
		setUserDetails({});
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
								//<ProtectedRoute>
								<Login />
								//</ProtectedRoute>
							}
						/>
						<Route
							path="/forgot-password"
							element={
								// <ProtectedRoute>
								<ForgotPasswordPage />
								// //</ProtectedRoute>
							}
						/>
						<Route
							path="/dashboard"
							element={
								//<ProtectedRoute>
								<Dashboard />
								//</ProtectedRoute>
							}
						/>
						<Route
							path="/user-management"
							element={
								//<ProtectedRoute>
								<UserManagementPage />
								//</ProtectedRoute>
							}
						/>
						<Route
							path="/override-weather-info"
							element={
								//<ProtectedRoute>
								<OverrideWeatherInfoPage />
								//</ProtectedRoute>
							}
						/>
						<Route
							path="/weather-alert"
							element={
								//<ProtectedRoute>
								<WeatherAlertPage />
								//</ProtectedRoute>
							}
						/>
						<Route
							path="/role"
							element={
								//<ProtectedRoute>
								<RoleManagement />
								//</ProtectedRoute>
							}
						/>
						<Route
							path="/subscription"
							element={
								//<ProtectedRoute>
								<Subscription />
								//</ProtectedRoute>
							}
						/>
						<Route
							path="/posts-articles"
							element={
								//<ProtectedRoute>
								<PostsArticlesPage />
								//</ProtectedRoute>
							}
						/>
						<Route
							path="/activity-log"
							element={
								//<ProtectedRoute>
								<ActivityLogPage />
								//</ProtectedRoute>
							}
						/>
						<Route
							path="/notification"
							element={
								// <ProtectedRoute>
								<NotificationSystemPage />
								// </ProtectedRoute>
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
