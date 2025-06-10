import { create } from "zustand";

type AppState = {
	isDark: boolean;
	isLoading: boolean;
	isUserDetails: boolean;
	userDetails: Record<string, any>;
	premiumStep: number;
	setIsDark: (isDark: boolean) => void;
	setIsLoading: (isLoading: boolean) => void;
	setUserDetails: (details: Record<string, any>) => void;
	setPremiumStep: (step: number) => void;
};

const useAppState = create<AppState>(set => ({
	isDark: false,
	isLoading: false,
	isUserDetails: false,
	userDetails: {},
	premiumStep: 1,

	// Actions
	setIsDark: isDark => set({ isDark }),
	setIsLoading: isLoading => set({ isLoading }),
	setUserDetails: details => set({ userDetails: details, isUserDetails: !!details }),
	setPremiumStep: step => set({ premiumStep: step }),
}));

export default useAppState;
