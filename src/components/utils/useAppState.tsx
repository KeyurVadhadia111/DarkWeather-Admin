import React, { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import type { Dispatch, Reducer } from "react";

export const StateContext = createContext<any>({});

export const initialState: any = {
	isDark: false,
	isLoading: false,
	isUserDetails: false,
	userDetails: {},
	forecastTab: "Today",
	questionTabs: "General Information",
	premiumStep: 1,
	currentPremiumPlan: {},
};

let globalState: any = initialState;
let globalDispatch: Dispatch<any>;

export const getState = () => globalState;
export const getDispatch = () => globalDispatch;

export const StateProvider = function <I>({
	reducer,
	initialState,
	children,
}: {
	reducer: Reducer<any, any>;
	initialState: I;
	children: ReactNode;
}) {
	const [state, setAppState] = useReducer(reducer, initialState);
	useEffect(() => {
		globalState = state;
		globalDispatch = setAppState;
	}, [state]);
	return <StateContext.Provider value={[state, setAppState]}>{children}</StateContext.Provider>;
};

export const useAppState = () => useContext(StateContext);
