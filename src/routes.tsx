import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { initialState, StateProvider, useAppState } from "components/utils/useAppState";
import Login from "pages/Login";
import App from "pages/App";
import AccessDisabled from "pages/AccessDisabled";
import Register from "pages/Register";
import ForgotPasswordPage from "pages/ForgotPasswordPage";

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
	const [{ userDetails }, setAppState] = useAppState();
	const user = JSON.parse(localStorage.getItem("auth") || "{}");

	const isAuthPage =
		location.pathname === "/login" ||
		location.pathname === "/register" ||
		location.pathname === "/forgot-password" ||
		location.pathname === "/forecast";

	if (location.pathname === "/") {
		return <>{children}</>;
	}
	if (user?._id) {
		// User is logged in, block access to login/register
		if (isAuthPage) {
			return <Navigate to="/" replace />;
		}
		// Allow access to other routes
		return <>{children}</>;
	} else {
		// Not logged in, allow access only to login/register
		if (isAuthPage) {
			return <>{children}</>;
		}
		setAppState({ userDetails: {} });
		// Redirect to login for protected routes
		return <Navigate to="/login" replace />;
	}
};

const createRoutes: React.FC = () => {
	return (
		<BrowserRouter>
			<StateProvider initialState={initialState} reducer={reducer}>
				<QueryClientProvider client={queryClient}>
					<Routes>
						<Route path="/" element={<App />}>
							{/* Default route redirecting to /pricing */}
							<Route index element={<Navigate to="/login" replace />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/forgot-password" element={<ForgotPasswordPage />} />
							<Route path="access_disabled" element={<AccessDisabled />} />
							<Route path="*" element={<Navigate to="/" />} />
						</Route>
					</Routes>
				</QueryClientProvider>
			</StateProvider>
		</BrowserRouter>
	);
};

export default createRoutes;
