import ky from "ky";
import { toast } from "components/utils/toast";
import { setIsLoading } from "components/utils/StoreActions";

const authClient = ky.extend({
	prefixUrl: import.meta.env.VITE_API_URL,
	hooks: {
		afterResponse: [
			async (request, options, response) => {
				const error1 = await response.text();
				if (
					request.url.split("/").pop() !== "login" &&
					(response.status === 401 || (response.status === 403 && JSON.parse(error1).force_relogin))
				) {
					setIsLoading(false);
					window.location.href = '/login';
				}
			},
		],
	},
	timeout: 120000,
	credentials: "include",
});

const apiClient = ky.create({
	prefixUrl: import.meta.env.VITE_API_URL,
	credentials: "include", // ✅ crucial for cookies or sessions
	hooks: {
		beforeRequest: [
			(request, options) => {
				const accessToken = JSON.parse(localStorage.getItem("auth") || "{}")?.access_token;

				if (accessToken) {
					options.headers.set("Authorization", `Bearer ${accessToken}`);
				}

				options.headers.set("Content-Type", "application/json");

				return request;
			}
		],
		afterResponse: [
			async (request, options, response) => {
				if (response.status == 599) {
					const res = await response.json();
					toast.error(res.error);
					setIsLoading(false);
				} else {
					if (response.status === 401) {
						setIsLoading(false);
						// Optional: redirect to login or show a toast
					} else if (response.status === 500) {
						setIsLoading(false);
					}
				}
			},
		],
	},
});

const publicClient = ky.create({
	prefixUrl: import.meta.env.VITE_API_URL,
	timeout: 60000,
	// Do not include credentials
	credentials: "include",
	// Allow external public APIs, hence no prefixUrl
	hooks: {},
});

export { authClient, apiClient, publicClient };
