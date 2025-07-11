import { create } from "zustand";

type AppState = {
	isDark: boolean;
	isLoading: boolean;
	isUserDetails: boolean;
	userDetails: Record<string, any>;
	premiumStep: number;
	isSideExpanded: boolean;
	isMenuOpen: boolean; 
	setIsDark: (isDark: boolean) => void;
	setIsLoading: (isLoading: boolean) => void;
	setUserDetails: (details: Record<string, any>) => void;
	setPremiumStep: (step: number) => void;
	setIsSideExpanded: (isSideExpanded: boolean) => void;
	setIsMenuOpen: (isOpen: boolean) => void; 
};

const useAppState = create<AppState>(set => ({
	isDark: false,
	isLoading: false,
	isUserDetails: false,
	userDetails: {},
	premiumStep: 1,
	isSideExpanded: true,
	isMenuOpen: false, 

	// Actions
	setIsDark: isDark => set({ isDark }),
	setIsLoading: isLoading => set({ isLoading }),
	setUserDetails: details => set({ userDetails: details, isUserDetails: !!details }),
	setPremiumStep: step => set({ premiumStep: step }),
	setIsSideExpanded: isSideExpanded => set({ isSideExpanded }),
	setIsMenuOpen: isMenuOpen => set({ isMenuOpen }),
}));

export default useAppState;
