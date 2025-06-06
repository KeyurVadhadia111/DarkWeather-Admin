import ky from "ky";

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
					// window.location.href = '/login';
				}
			},
		],
	},
	timeout: 120000,
	credentials: "include",
});

const apiClient = ky.create({
	prefixUrl: import.meta.env.VITE_API_URL,
	// credentials: "same-origin",
	hooks: {
		beforeRequest: [
			async (request, options) => {
				const url = new URL(request.url);
				// const { authToken } = getState();
				const accessToken = localStorage.getItem("auth") || "";
				const enc = accessToken || '';
				const headers = {
					// "Content-Type": "text/plain",
					"Content-Type": "application/json",
					// "auth-key": "123",
					"authorization": accessToken ? `tma ${enc}` : "",
					"bypass-tunnel-reminder": "some_value",
				};

				options.headers = new Headers(headers);
				// options.headers.set("Content-Type", "text/plain");
				return new Request(url, options);
			},
		],
		afterResponse: [
			async (request, options, response) => {
				if (response.status === 401) {
					// logout();
					// window.location.href = "/access_disabled"; // Redirect to login
				}
			},
		],
	},
	timeout: 180000,
	credentials: "include",
});

export { authClient, apiClient };
