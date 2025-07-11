import useAppState from "components/utils/useAppState";
import { } from "react";
import React, { useEffect, useRef, useMemo, useState } from "react";
import DeleteUserPopup from "components/popup/DeleteUserPopup";
import { toast } from "components/utils/toast";
import EmailSettings from "components/SettingsConfigurations/EmailSettings";
import SystemWideFeature from "components/SettingsConfigurations/SystemWideFeature";
import TimeZone from "components/SettingsConfigurations/TimeZone";
import AddEditAddEditPaymentConfigurationPopup from "components/popup/AddEditAddEditPaymentConfigurationPopup";
import SmsSettings from "components/SettingsConfigurations/SmsSettings";
import PaymentConfiguration from "components/SettingsConfigurations/PaymentConfiguration";
import Slack from "components/SettingsConfigurations/Slack";
import ZoomConfiguration from "components/SettingsConfigurations/ZoomConfiguration";
import ActivitiesConfiguration from "components/SettingsConfigurations/ActivitiesConfiguration";
import ApiIntegration from "components/SettingsConfigurations/ApiIntegration";
import AddEditAddEditApiIntegrationPopup from "components/popup/AddEditAddEditApiIntegrationPopup";

interface APIIntegrationType {
	id: number;
	provider: string;
	baseURL: string;
	retryPolicy: string;
	fallbackProvider: string;
	timeoutMs: number;
	environment: string;
	status: string;
	statusColor: string;
}

interface PaymentConfigurationType {
	id: number;
	paymentGateway: string;
	apiKey: string;
	customGateway: string;
	webhookURL: string;
	currency: string;
	country: string;
	status: string;
	statusColor: string;
}

interface SortConfigAPIIntegration {
	key: keyof APIIntegrationType;
	direction: "asc" | "desc";
}

interface SortConfigPayment {
	key: keyof PaymentConfigurationType;
	direction: "asc" | "desc";
}

export default function SettingsConfigurationsPage() {

	const notificationBar = [
		{
			id: 1,
			title: "System-Wide Feature",
			name: "systemWideFeature"
		},
		{
			id: 2,
			title: "Email",
			name: "email"
		},
		{
			id: 3,
			title: "Time-zone",
			name: "timeZone"
		},
		{
			id: 4,
			title: "SMS",
			name: "sms"
		},
		{
			id: 5,
			title: "Payment",
			name: "payment"
		},
		{
			id: 6,
			title: "Slack",
			name: "slack"
		},
		{
			id: 7,
			title: "Zoom",
			name: "zoom"
		},
		{
			id: 8,
			title: "Activities",
			name: "activities"
		},
		{
			id: 9,
			title: "API",
			name: "api"
		},
	]

	const [paymentConfiguration, setPaymentConfiguration] = useState<PaymentConfigurationType[]>([
		{
			id: 1,
			paymentGateway: "PayPal",
			apiKey: "465",
			customGateway: "sk_test_paypal_abcdefgh12345678",
			webhookURL: "https://yourapp.com/webhooks/paypal",
			currency: "INR",
			country: "India",
			status: "Connected",
			statusColor: "text-textGreen",
		},
		{
			id: 2,
			paymentGateway: "Razorpay",
			apiKey: "465",
			customGateway: "sk_test_razorpay_abcdefgh12345678",
			webhookURL: "https://yourapp.com/webhooks/razorpay",
			currency: "INR",
			country: "India",
			status: "Not Connected",
			statusColor: "text-textRed",
		},
		{
			id: 3,
			paymentGateway: "Strip",
			apiKey: "465",
			customGateway: "sk_test_stripe_abcdefgh12345678",
			webhookURL: "https://yourapp.com/webhooks/stripe",
			currency: "INR",
			country: "India",
			status: "Connected",
			statusColor: "text-textGreen",
		}
	]);

	const [apiIntegration, setApiIntegration] = useState<APIIntegrationType[]>([
		{
			id: 1,
			provider: "OpenWeather",
			baseURL: "https://api.openweathermap.org",
			retryPolicy: "3 Retries",
			fallbackProvider: "WeatherAPI",
			timeoutMs: 3000,
			environment: "Production",
			status: "Enable",
			statusColor: "text-textGreen",
		},
		{
			id: 2,
			provider: "WeatherAPI",
			baseURL: "https://api.weatherapi.com/v1",
			retryPolicy: "2 Retries",
			fallbackProvider: "OpenWeather",
			timeoutMs: 4000,
			environment: "Staging",
			status: "Enable",
			statusColor: "text-textGreen",
		},
		{
			id: 3,
			provider: "AccuWeather",
			baseURL: "https://dataservice.accuweather.org",
			retryPolicy: "3 Retries",
			fallbackProvider: "WeatherAPI",
			timeoutMs: 5000,
			environment: "Production",
			status: "Disable",
			statusColor: "text-textRed",
		},
		{
			id: 4,
			provider: "Climacell",
			baseURL: "https://api.tomorrow.io/v4.com",
			retryPolicy: "2 Retries",
			fallbackProvider: "OpenWeather",
			timeoutMs: 4500,
			environment: "Development",
			status: "Enable",
			statusColor: "text-textGreen",
		},
		{
			id: 5,
			provider: "WeatherStack",
			baseURL: "http://api.weatherstack.com",
			retryPolicy: "2 Retries",
			fallbackProvider: "OpenWeather",
			timeoutMs: 3500,
			environment: "Production",
			status: "Disable",
			statusColor: "text-textRed",
		},
	]);

	const [activeTab, setActiveTab] = useState(() => {
		const savedTab = localStorage.getItem("activeTab");
		return savedTab || notificationBar[0].name;
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [PostArticlePerPage] = useState(12);

	const [sortConfigAPIIntegration, setSortConfigAPIIntegration] = useState<SortConfigAPIIntegration>({
		key: "provider",
		direction: "asc",
	});
	const [SortConfigPayment, setSortConfigPayment] = useState<SortConfigPayment>({
		key: "paymentGateway",
		direction: "asc",
	});
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [isAddEditPaymentConfigurationPopup, setIsAddEditPaymentConfigurationPopup] = useState(false);
	const [isAddEditApiIntegrationPopup, setIsAddEditApiIntegrationPopup] = useState(false);
	const isSideExpanded = useAppState(state => state.isSideExpanded);
	const [showAllTabs, setShowAllTabs] = useState(false);

	// Inside SettingsConfigurationsPage component
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [visibleTabs, setVisibleTabs] = useState(notificationBar);
	const [hiddenTabs, setHiddenTabs] = useState<typeof notificationBar>([]);
	const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

	// Adjust visible/hidden tabs based on width
	useEffect(() => {
		const updateVisibleTabs = () => {
			if (!containerRef.current) return;

			if (showAllTabs) {
				setVisibleTabs(notificationBar);
				setHiddenTabs([]);
				return; // prevent infinite recalculation
			}

			const containerWidth = containerRef.current.offsetWidth;
			let usedWidth = 0;
			let lastVisibleIndex = -1;

			for (let i = 0; i < notificationBar.length; i++) {
				const tabWidth = tabRefs.current[i]?.offsetWidth || 0;

				// Reserve ~80px for "+More"
				if (usedWidth + tabWidth <= containerWidth - 80) {
					usedWidth += tabWidth;
					lastVisibleIndex = i;
				} else {
					break;
				}
			}

			setVisibleTabs(notificationBar.slice(0, lastVisibleIndex + 1));
			setHiddenTabs(notificationBar.slice(lastVisibleIndex + 1));
		};

		const observer = new ResizeObserver(updateVisibleTabs);
		if (containerRef.current) observer.observe(containerRef.current);
		updateVisibleTabs();

		return () => observer.disconnect();
	}, [showAllTabs]);



	const startIdx = (currentPage - 1) * PostArticlePerPage;
	const endIdx = Math.min(
		startIdx + PostArticlePerPage,
		activeTab === "api"
			? apiIntegration.length
			: paymentConfiguration.length
	);

	const [isDeleteUserPopupOpen, setIsDeleteUserPopupOpen] = useState(false);
	const [deleteUserIndex, setDeleteUserIndex] = useState<number | null>(null);

	const [searchQuery, setSearchQuery] = useState("");

	// Filter Manage Temaplate by search query (name or email)
	const filteredApiIntegration = useMemo(() => {
		if (!searchQuery.trim()) return apiIntegration;
		const query = searchQuery.toLowerCase();
		return apiIntegration.filter(
			item => item.provider.toLowerCase().includes(query) || item.provider.toLowerCase().includes(query),
		);
	}, [apiIntegration, searchQuery]);

	const filteredPayment = useMemo(() => {
		if (!searchQuery.trim()) return paymentConfiguration;
		const query = searchQuery.toLowerCase();
		return paymentConfiguration.filter(
			item => item.paymentGateway.toLowerCase().includes(query) || item.paymentGateway.toLowerCase().includes(query) ||
				item.currency.toLowerCase().includes(query) || item.currency.toLowerCase().includes(query) ||
				item.country.toLowerCase().includes(query) || item.country.toLowerCase().includes(query) ||
				item.status.toLowerCase().includes(query) || item.status.toLowerCase().includes(query)
		);
	}, [paymentConfiguration, searchQuery]);

	const sortedApiIntegration = useMemo(() => {
		const sorted = [...filteredApiIntegration].sort((a: APIIntegrationType, b: APIIntegrationType) => {
			const key = sortConfigAPIIntegration.key;
			let valA = a[key];
			let valB = b[key];

			if (typeof valA === "string" && typeof valB === "string") {
				valA = valA.toLowerCase();
				valB = valB.toLowerCase();
			}

			if (valA < valB) return sortConfigAPIIntegration.direction === "asc" ? -1 : 1;
			if (valA > valB) return sortConfigAPIIntegration.direction === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [filteredApiIntegration, sortConfigAPIIntegration]);

	const sortedPayment = useMemo(() => {
		const sorted = [...filteredPayment].sort((a: PaymentConfigurationType, b: PaymentConfigurationType) => {
			const key = SortConfigPayment.key;
			let valA = a[key];
			let valB = b[key];

			if (typeof valA === "string" && typeof valB === "string") {
				valA = valA.toLowerCase();
				valB = valB.toLowerCase();
			}

			if (valA < valB) return SortConfigPayment.direction === "asc" ? -1 : 1;
			if (valA > valB) return SortConfigPayment.direction === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [filteredPayment, SortConfigPayment]);

	const displayedApiIntegration = useMemo(() => {
		return sortedApiIntegration.slice(startIdx, endIdx);
	}, [sortedApiIntegration, startIdx, endIdx]);

	const displayedPayment = useMemo(() => {
		return sortedPayment.slice(startIdx, endIdx);
	}, [sortedPayment, startIdx, endIdx]);

	const handleSortAPIIntegration = (key: keyof APIIntegrationType) => {
		setSortConfigAPIIntegration(prevConfig => ({
			key,
			direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
		}));
	};

	const handleSortPayment = (key: keyof PaymentConfigurationType) => {
		setSortConfigPayment(prevConfig => ({
			key,
			direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
		}));
	};



	// Reset to page 1 when searchQuery changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery]);

	return (
		<div
			className={`${isSideExpanded ? "w-full sm:w-[calc(100vw-385px)]" : "w-full sm:w-[calc(100vw-163px)]"} flex flex-col items-start gap-5 sm:gap-6 p-2.5 sm:p-6 bg-bgc dark:bg-fgcDark rounded-[10px] sm:rounded-[20px]`}>
			{/* ...header and search/filter UI... */}
			<div className="flex flex-col items-center justify-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
				<div className="flex sm:h-14 items-center w-full">
					<div className="relative font-medium text-text dark:text-textDark text-xl sm:text-2xl tracking-[0] leading-5 sm:leading-6 whitespace-nowrap">
						Settings & Configurations
					</div>
				</div>
				<div className="flex sm:flex-row flex-col items-center justify-between gap-2 sm:gap-4 w-full">
					<div
						ref={containerRef}
						className={`w-[90%] flex items-center gap-3 bg-bgc dark:bg-bgcDark rounded-xl shadow-[0px_10px_65px_#0000000d] whitespace-nowrap ${showAllTabs ? "overflow-x-auto" : "md:overflow-hidden overflow-x-auto"
							}`}
					>
						{visibleTabs.map((item, index) => (
							<div
								ref={(el) => {
									tabRefs.current[index] = el;
								}}
								key={item.id}
								onClick={() => {
									setActiveTab(item.name);
									localStorage.setItem("activeTab", item.name);
								}}
								className={`py-2.5 px-5 rounded-lg cursor-pointer transition-all duration-200 ${activeTab === item.name ? "bg-primary font-semibold text-text" : "text-gray-700 dark:text-white"
									}`}
							>
								<span className="sm:text-base">{item.title}</span>
							</div>
						))}
					</div>

					{!showAllTabs && hiddenTabs.length > 0 && (
						<div
							onClick={() => setShowAllTabs(true)}
							className="rounded-lg cursor-pointer text-sm font-medium whitespace-nowrap text-primary"
						>
							+{hiddenTabs.length} More
						</div>
					)}
				</div>
			</div>

			<div className="w-full">
				{activeTab === "systemWideFeature" && <SystemWideFeature />}
				{activeTab === "email" &&
					<EmailSettings />
				}

				{activeTab === "timeZone" && <TimeZone />}
				{activeTab === "sms" &&
					<SmsSettings />
				}
				{activeTab === "payment" && <PaymentConfiguration
					item={displayedPayment}
					paymentConfiguration={paymentConfiguration}
					handleSort={handleSortPayment}
					sortConfig={SortConfigPayment}
					filteredPayment={filteredPayment}
					startIdx={startIdx}
					endIdx={endIdx}
					PostArticlePerPage={PostArticlePerPage}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					setDeleteUserIndex={setDeleteUserIndex}
					setIsDeleteUserPopupOpen={setIsDeleteUserPopupOpen}
					setEditIndex={setEditIndex}
					setIsAddEditPaymentConfigurationPopup={setIsAddEditPaymentConfigurationPopup}
					setIsAddEditPaymentConfigurationPopupOpen={setIsAddEditPaymentConfigurationPopup}
					searchText={searchQuery}
					setSearchText={setSearchQuery}
				/>}
				{activeTab === "slack" &&
					<Slack />
				}
				{activeTab === "zoom" &&
					<ZoomConfiguration />
				}
				{activeTab === "activities" &&
					<ActivitiesConfiguration />
				}
				{activeTab === "api" && <ApiIntegration
					item={displayedApiIntegration}
					apiIntegration={apiIntegration}
					handleSort={handleSortAPIIntegration}
					sortConfig={sortConfigAPIIntegration}
					filteredApiIntegration={filteredApiIntegration}
					startIdx={startIdx}
					endIdx={endIdx}
					PostArticlePerPage={PostArticlePerPage}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					setDeleteUserIndex={setDeleteUserIndex}
					setIsDeleteUserPopupOpen={setIsDeleteUserPopupOpen}
					setEditIndex={setEditIndex}
					setIsAddEditApiIntegrationPopup={setIsAddEditApiIntegrationPopup}
					searchText={searchQuery}
					setSearchText={setSearchQuery}
				/>}
			</div>



			<AddEditAddEditPaymentConfigurationPopup
				isOpen={isAddEditPaymentConfigurationPopup}
				setIsOpen={() => {
					setEditIndex(null);
					setIsAddEditPaymentConfigurationPopup(false);
				}}
				list={paymentConfiguration}
				setList={setPaymentConfiguration}
				editIndex={editIndex}
			/>

			<AddEditAddEditApiIntegrationPopup
				isOpen={isAddEditApiIntegrationPopup}
				setIsOpen={() => {
					setEditIndex(null);
					setIsAddEditApiIntegrationPopup(false);
				}}
				list={apiIntegration}
				setList={setApiIntegration}
				editIndex={editIndex}
			/>


			<DeleteUserPopup
				isOpen={isDeleteUserPopupOpen}
				setIsOpen={setIsDeleteUserPopupOpen}
				user={
					deleteUserIndex !== null
						? activeTab === "payment"
							? { name: paymentConfiguration[deleteUserIndex]?.paymentGateway }
							: activeTab === "api"
								? { name: apiIntegration[deleteUserIndex]?.provider }
								: null
						: null
				}
				itemType={
					activeTab === "payment"
						? "payment Details"
						: activeTab === "api"
							? "API Integration"
							: ""
				}
				onDelete={() => {
					if (deleteUserIndex !== null) {
						if (activeTab === "api") {
							setApiIntegration(prev => prev.filter((_, idx) => idx !== deleteUserIndex));
						} else {
							setPaymentConfiguration(prev => prev.filter((_, idx) => idx !== deleteUserIndex));
						}

						setDeleteUserIndex(null);
						setIsDeleteUserPopupOpen(false);
						toast.success("Item deleted successfully");
					}
				}}
			/>
		</div>
	);
}
