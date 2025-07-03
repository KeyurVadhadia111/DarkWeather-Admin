import useAppState from "./useAppState";

export const setIsLoading = (value: boolean) => {
	useAppState.getState().setIsLoading(value);
};
