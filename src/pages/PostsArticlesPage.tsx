import AddEditPostArticlePopup from "components/popup/AddEditPostArticlePopup";
import { Menu, Transition } from "@headlessui/react";
import { Button } from "components/utils/Button";
import Icon from "components/utils/Icon";
import { Input } from "components/utils/Input";
import Pagination from "components/utils/Pagination";
import useAppState from "components/utils/useAppState";
import React, { useEffect, useMemo, useState } from "react";
import DeleteUserPopup from "components/popup/DeleteUserPopup";
import PostArticleArchivePopup from "components/popup/PostArticleArchivePopup";
import { useNavigate } from "react-router-dom";
import { toast } from "components/utils/toast";
import ArticleSelectionSection from "components/ArticleSelectionSection";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ScheduleConfirmation from "components/popup/ScheduleConfirmation";
import { apiClient } from "api/client";

interface PostArticle {
	id: number;
	title: string;
	type: string;
	scheduledFor: string;
	createdBy: string;
	createdOn: string;
	status: string;
	statusColor: string;
}

interface SortConfig {
	key: string;
	direction: "asc" | "desc";
}

const articleSchema = yup.object({
	article1: yup.string(),
	article2: yup.string(),
	article3: yup.string(),
	article4: yup.string(),
	article5: yup.string(),
	article6: yup.string(),
	article7: yup.string(),
});
type ArticleFormData = {
	article1: any
	article2: any
	article3: any
	article4: any
	article5: any
	article6: any
	article7: any
}


export default function PostsArticlesPage() {

	const [postArticle, setPostArticle] = useState<PostArticle[]>([]);
	const [articleOptions1, setArticleOptions1] = useState([]);
	const [articleOptions2, setArticleOptions2] = useState([]);
	const [totalArticlesCount, setTotalArticlesCount] = useState(0);
	const [startIdx, setStartIdx] = useState(0);
	const [endIdx, setEndIdx] = useState(0);

	const {
		handleSubmit: handleSubmitTop,
		formState: { errors: errorsTop },
		setValue: setValueTop,
		register: registerTop,
		reset: resetTop,
		trigger: triggerTop,
	} = useForm<ArticleFormData>({
		resolver: yupResolver(articleSchema),
		defaultValues: {
			article1: undefined,
			article2: undefined,
			article3: undefined,
			article4: undefined,
			article5: undefined,
			article6: undefined,
			article7: undefined,
		},
	});

	const {
		handleSubmit: handleSubmitSevere,
		formState: { errors: errorsSevere },
		setValue: setValueSevere,
		register: registerSevere,
		reset: resetSevere,
		trigger: triggerSevere,
	} = useForm<ArticleFormData>({
		resolver: yupResolver(articleSchema),
		defaultValues: {
			article1: undefined,
			article2: undefined,
			article3: undefined,
			article4: undefined,
			article5: undefined,
			article6: undefined,
			article7: undefined,
		},
	});

	useEffect(() => {
		const articleKeys = [
			"article1", "article2", "article3", "article4",
			"article5", "article6", "article7",
		] as (keyof ArticleFormData)[];
		articleKeys.forEach(key => {
			registerTop(key);
			registerSevere(key);
		});
	}, [registerTop, registerSevere]);



	const [selectedPostArticle, setSelectedPostArticle] = useState<number[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [PostArticlePerPage] = useState(10);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "title",
		direction: "asc",
	});
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [isAddEditPostArticlePopupOpen, setIsAddEditPostArticlePopupOpen] = useState(false);
	const isSideExpanded = useAppState(state => state.isSideExpanded);

	const [isDeleteUserPopupOpen, setIsDeleteUserPopupOpen] = useState(false);
	const [deleteUserIndex, setDeleteUserIndex] = useState<number | null>(null);
	const [isArchivePopupOpen, setIsArchivePopupOpen] = useState(false);
	const [selectedArchiveItem, setSelectedArchiveItem] = useState<PostArticle | null>(null);
	const [showScheduleConfirm, setShowScheduleConfirm] = useState(false);
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);


	const [searchQuery, setSearchQuery] = useState("");

	const [topStoriesSelections, setTopStoriesSelections] = useState<Record<string, number | null>>({});
	const [severeWeatherSelections, setSevereWeatherSelections] = useState<Record<string, number | null>>({});


	const allSelectedIds = [
		...Object.values(topStoriesSelections),
		...Object.values(severeWeatherSelections),
	].filter((id): id is number => id !== null);


	const getFilteredOptions = (currentName: string, group: "top" | "severe") => {
		const currentSelections = group === "top" ? topStoriesSelections : severeWeatherSelections;

		const selectedIds = Object.entries(currentSelections)
			.filter(([key, value]) => key !== currentName && value !== null)
			.map(([_, value]) => value as number);

		const currentValue = currentSelections[currentName];

		return articleOptions1.map(option => ({
			value: option.id,
			text: option.title,
			disabled: option.id !== currentValue && selectedIds.includes(option.id),
		}));
	};

	const getFilteredOptions2 = (currentName: string, group: "top" | "severe") => {
		const currentSelections = group === "top" ? topStoriesSelections : severeWeatherSelections;

		const selectedIds = Object.entries(currentSelections)
			.filter(([key, value]) => key !== currentName && value !== null)
			.map(([_, value]) => value as number);

		const currentValue = currentSelections[currentName];

		return articleOptions2.map(option => ({
			value: option.id,
			text: option.title,
			disabled: option.id !== currentValue && selectedIds.includes(option.id),
		}));
	};

	const handleSelectChange = (articleKey: string, selectedId, sectionKey: string) => {
		if (sectionKey === "top") {
			setTopStoriesSelections(prev => ({ ...prev, [articleKey]: selectedId }));
		} else {
			setSevereWeatherSelections(prev => ({ ...prev, [articleKey]: selectedId }));
		}
	};


	// Filter PostArticle by search query (name or email)
	const filteredPostArticle = useMemo(() => {
		if (!searchQuery.trim()) return postArticle;
		const query = searchQuery.toLowerCase();
		return postArticle.filter(
			item => item.title.toLowerCase().includes(query) || item.type.toLowerCase().includes(query),
		);
	}, [postArticle, searchQuery]);

	const sortedPostArticle = useMemo(() => {
		const sorted = [...filteredPostArticle].sort((a: PostArticle, b: PostArticle) => {
			const key = sortConfig.key;
			let valA = a[key];
			let valB = b[key];

			if (typeof valA === "string" && typeof valB === "string") {
				if (key === "createdOn") {
					const convertToDate = (str: string): number => {
						if (str.toLowerCase().includes("today")) return new Date().getTime();
						if (str.toLowerCase().includes("yesterday")) {
							const date = new Date();
							date.setDate(date.getDate() - 1);
							return date.getTime();
						}
						return new Date(str).getTime();
					};
					return sortConfig.direction === "asc"
						? convertToDate(valA) - convertToDate(valB)
						: convertToDate(valB) - convertToDate(valA);
				}
				valA = valA.toLowerCase();
				valB = valB.toLowerCase();
			}

			if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
			if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [filteredPostArticle, sortConfig]);

	const displayedPostArticle = postArticle;

	const handleSort = (key) => {
		setSortConfig(prevConfig => ({
			key,
			direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
		}));
		setCurrentPage(1);
		fetchPaginatedArticles(1, key, sortConfig.direction);
	};

	/* Start for checkbox */
	const allChecked = displayedPostArticle.length > 0 && displayedPostArticle.every((u: PostArticle) => selectedPostArticle.includes(u.id));
	const isIndeterminate =
		displayedPostArticle.length > 0 && selectedPostArticle.some(id => displayedPostArticle.some(u => u.id === id)) && !allChecked;

	const handleSelectAll = () => {
		if (allChecked) {
			const pageIds = displayedPostArticle.map((u: PostArticle) => u.id);
			setSelectedPostArticle(prev => prev.filter(id => !pageIds.includes(id)));
		} else {
			const pageIds = displayedPostArticle.map((u: PostArticle) => u.id);
			setSelectedPostArticle(prev => [...new Set([...prev, ...pageIds])]);
		}
	};

	const handleCheckbox = (id: number) => {
		if (selectedPostArticle.includes(id)) {
			setSelectedPostArticle(prev => prev.filter(itemId => itemId !== id));
		} else {
			setSelectedPostArticle(prev => [...prev, id]);
		}
	};

	const handleArchive = () => {
		archiveArticle();
		setSelectedArchiveItem(null);
	};

	const handleDraft = (id: any) => {
		setPostArticle((prev) =>
			prev.map((article) =>
				article.id === id
					? { ...article, status: "Published", statusColor: "text-textGreen" }
					: article
			)
		);
		toast.success("Item published successfully!");
		setSelectedArchiveItem(null);
	};


	const onSubmitTop: SubmitHandler<ArticleFormData> = async () => {
		Object.entries(topStoriesSelections).forEach(([key, val]) => {
			setValueSevere(key as keyof ArticleFormData, val ?? undefined);
		});
		saveTopStoriesOptions();
	};

	const onSubmitSevere: SubmitHandler<ArticleFormData> = async () => {
		Object.entries(severeWeatherSelections).forEach(([key, val]) => {
			setValueSevere(key as keyof ArticleFormData, val ?? undefined);
		});
		saveSevereWeatherOptions();
	};

	const saveSevereWeatherOptions = async () => {
		try {
			const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
			const selectedIds = Object.values(severeWeatherSelections);

			const selectedArticles = articleOptions2.filter(option =>
				selectedIds.includes(option.id)
			);
			const response = await apiClient.post('api/article/reorder', {
				json: {
					articles: selectedArticles.map((x, idx) => ({
						uuid: x.id,
						sequence: idx,
					})),
				},
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				toast.success(`Severe Weather articles updated successfully!`);
			}

		} catch (error) {

		}
	};

	const saveTopStoriesOptions = async () => {
		try {
			const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
			const selectedIds = Object.values(topStoriesSelections);

			const selectedArticles = articleOptions1.filter(option =>
				selectedIds.includes(option.id)
			);
			const response = await apiClient.post('api/article/reorder', {
				json: {
					articles: selectedArticles.map((x, idx) => ({
						uuid: x.id,
						sequence: idx,
					})),
				},
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				toast.success(`Top stories updated successfully!`);
			}

		} catch (error) {

		}
	};

	const stripHTMLandDecodeEntities = (html: string) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		return doc.body.textContent || "";
	}

	const fetchPaginatedArticles = async (page: number, key: string, order: string) => {
		try {
			const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
			const response = await apiClient.post(`api/article/all?page=${page}&limit=10&sort_by=${key}&order=${order}`, {
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json', // optional
				},
			});

			const resJson = await response.json();
			const articlesData = resJson.data.articles;


			const mappedArticles = articlesData.map((article) => ({
				id: article.uuid,
				title: article.main_title,
				type: article.type.toLowerCase()
					.replace('_', ' ')
					.split(' ')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' '),
				scheduledFor: article.publish_at ? (new Date(article.publish_at).toLocaleString("en-US", {
					dateStyle: "long",
					timeStyle: "short",
				})) : "",
				createdBy: "John Smith",
				createdOn: "Jun 26, 2025",
				headerImage: article.header_image,
				thumbnailImage: article.thumbnail_image,
				status: article.status.toLowerCase()
					.split(' ')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' '),
				statusColor: article.status == 'PUBLISHED' ? "text-textGreen" : "text-textRed",
				titles: article.titles_descriptions,
			}));

			setPostArticle(mappedArticles);
			setTotalArticlesCount(resJson.data.total);
			setStartIdx((currentPage - 1) * 10);
			setEndIdx(Math.min(startIdx + 10, totalArticlesCount));
		} catch (error) {
			toast.error(error);
		}
	};

	const fetchArticleOptions = async () => {
		try {
			const response = await apiClient.get(`api/article/type/TOP_STORIES`);

			const resJson = await response.json();
			const articlesData = resJson.data;


			const mappedArticles = articlesData.map((article) => ({
				id: article.uuid,
				title: stripHTMLandDecodeEntities(article.main_title),
				sequence: article.sequence,
			}));
			setArticleOptions1(mappedArticles)
			const preSelections: Record<string, string | number> = {};
			mappedArticles.forEach(article => {
				if (article.sequence >= 0 && article.sequence <= 6) {
					preSelections[`article${article.sequence + 1}`] = article.id;
				}
			});
			setTopStoriesSelections(preSelections);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchSevereWeatherOptions = async () => {
		try {
			const response = await apiClient.get(`api/article/type/SEVERE_WEATHER`);

			const resJson = await response.json();
			const articlesData = resJson.data;


			const mappedArticles = articlesData.map((article) => ({
				id: article.uuid,
				title: stripHTMLandDecodeEntities(article.main_title),
				sequence: article.sequence,
			}));
			setArticleOptions2(mappedArticles)
			const preSelections = {};
			mappedArticles.forEach(article => {
				if (article.sequence >= 0 && article.sequence <= 6) {
					preSelections[`article${article.sequence + 1}`] = article.id;
				}
			});
			setSevereWeatherSelections(preSelections);
		} catch (error) {
			console.log(error);
		}
	};

	const archiveArticle = async () => {
		try {
			if (!selectedArchiveItem)
				return;

			const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
			const response = await apiClient.put(`api/article/archive/${selectedArchiveItem.id}`, {
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "application/json",
				}
			});

			if (response.ok) {
				toast.success(`Article archived successfully!`);
				fetchPaginatedArticles(1, sortConfig.key, sortConfig.direction);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const deleteArticle = async () => {
		try {
			if (!deleteUserIndex)
				return;

			const authToken = JSON.parse(localStorage.getItem('auth') || "{}")?.access_token;
			const response = await apiClient.delete(`api/article/delete/${postArticle[deleteUserIndex].id}`, {
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "application/json",
				}
			});

			if (response.ok) {
				toast.success(`Article deleted successfully!`);
				fetchPaginatedArticles(1, sortConfig.key, sortConfig.direction);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchPaginatedArticles(1, 'main_title', 'asc');
		fetchArticleOptions();
		fetchSevereWeatherOptions();
	}, [])

	// Reset to page 1 when searchQuery changes
	useEffect(() => {
		// setCurrentPage(1);
	}, [searchQuery]);

	return (
		<div
			className={`${isSideExpanded ? "w-full sm:w-[calc(100vw-385px)]" : "w-full sm:w-[calc(100vw-163px)]"} flex flex-col items-start gap-5 sm:gap-6 p-2.5 sm:p-6 bg-bgc dark:bg-fgcDark rounded-[10px] sm:rounded-[20px]`}>
			{/* ...header and search/filter UI... */}
			<div className="flex flex-col items-center justify-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
				<div className="flex sm:h-14 items-center w-full">
					<div className="relative font-medium text-text dark:text-textDark text-xl sm:text-2xl tracking-[0] leading-5 sm:leading-6 whitespace-nowrap">
						Content Post Management
					</div>
				</div>
				<div className="flex items-center justify-around gap-3 p-2.5 sm:px-6 sm:py-4 relative self-stretch w-full flex-[0_0_auto] bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-4 relative flex-1 grow w-full">
						<div className="flex items-center gap-3 relative w-full md:w-1/2">
							<div className="flex items-center w-full">
								<Icon
									icon="search"
									className="w-5 h-5 sm:w-6 sm:h-6 dark:text-textDark text-text shrink-0  absolute left-2.5 sm:left-3.5  z-10"
								/>
								<Input
									className="font-normal !pl-[35px] sm:!pl-[50px] !h-[42px] sm:!h-[56px] text-bgcSecondary dark:text-textDark text-sm whitespace-nowrap border-[none] !p-0 !outline-0 !ring-0 !self-stretch  !bg-fgc dark:!bg-fgcDark "
									placeholder="Search here..."
									type="text"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className="flex items-center justify-center w-[42px] h-[42px] sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden border border-solid border-textSecondary/50 shrink-0">
								<Icon
									icon="filter-user"
									className="w-5 h-5 sm:w-6 sm:h-6  text-textSecondary dark:text-textDark"
								/>
							</div>
						</div>
						<div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
							<Button
								className="flex h-[42px] sm:h-14 items-center justify-center gap-3 sm:px-6 py-3 sm:py-4 relative flex-[0_0_auto] bg-primary rounded-lg sm:rounded-xl"
								onClick={() => {
									setEditIndex(null);
									setIsAddEditPostArticlePopupOpen(true);
								}}>
								<Icon icon="plus" className="w-5 h-5 sm:w-7 sm:h-7" />
								<div className="relative  font-semibold text-text text-xs sm:text-base tracking-[0] leading-6 whitespace-nowrap">
									Add Post \ Article
								</div>
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full items-start gap-4 p-4 relative bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				<div className="w-full overflow-x-auto overflow-hidden">
					<table className="min-w-[950px] sm:min-w-[130px] w-full text-left border-separate border-spacing-0">
						<thead>
							<tr className="h-[42px] sm:h-[52px] bg-fgc dark:bg-fgcDark rounded-xl">
								<th className="px-[11px] sm:px-4 py-3.5">
									<label className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center cursor-pointer">
										<input
											type="checkbox"
											checked={allChecked}
											ref={(el) => {
												if (el) el.indeterminate = isIndeterminate;
											}}
											onChange={handleSelectAll}
											className="opacity-0 absolute w-5 h-5 sm:w-6 sm:h-6 cursor-pointer bg-transparent"
										/>
										<span
											className={`w-[17px] h-[17px] rounded-[2px] border border-textSecondary flex items-center justify-center transition-colors duration-150 ${allChecked || isIndeterminate
												? "bg-primary !border-primary"
												: "bg-transparent"
												}`}
										>
											{(allChecked || isIndeterminate) && (
												<Icon
													icon="check"
													className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-[1px] mt-0.5 sm:ml-0.5"
												/>
											)}
										</span>
									</label>
								</th>
								<th className="w-[152px] sm:w-[260px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("main_title")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Title</span>
										<Icon
											icon={sortConfig?.key === "main_title" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[95px] sm:w-[140px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("type")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Type</span>
										<Icon
											icon={sortConfig?.key === "type" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[180px] sm:w-[220px] px-3 sm:px-5 py-3.5" onClick={() => handleSort("publish_at")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Scheduled For</span>
										<Icon
											icon={sortConfig?.key === "publish_at" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[137px] sm:w-[180px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("author")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">
											Created By
										</span>
										<Icon
											icon={sortConfig?.key === "author" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[129px] sm:w-[180px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("created_at")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">
											Created On
										</span>
										<Icon
											icon={sortConfig?.key === "created_at" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[96.5px] sm:w-[130px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("status")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Status</span>
										<Icon
											icon={sortConfig?.key === "status" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[72px] sm:w-auto px-3 sm:px-5 py-3.5">
									<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Actions</span>
								</th>
							</tr>
						</thead>

						<tbody>
							{displayedPostArticle.length === 0 ? (
								<tr>
									<td colSpan={9} className="text-center py-11 text-textSecondary dark:text-textDark text-base sm:text-lg">
										No data found
									</td>
								</tr>
							) : (
								displayedPostArticle.map((item: any, idx) => {
									const isLastFour = displayedPostArticle.length >= 7 && idx >= displayedPostArticle.length - 4;
									const menuPositionClass = isLastFour
										? "origin-bottom-right bottom-full mb-2.5 sm:mb-[17px]"
										: "origin-top-right top-full mt-2.5 sm:mt-[17px]";
									return (
										<tr key={item.id} className="h-8 sm:h-11">
											<td className="px-[9px] sm:px-4 py-3.5">
												<label className="relative w-6 h-6 flex items-center justify-center cursor-pointer">
													<input
														type="checkbox"
														checked={selectedPostArticle.includes(item.id)}
														onChange={() => handleCheckbox(item.id)}
														className="opacity-0 absolute w-5 h-5 sm:w-6 sm:h-6 cursor-pointer bg-transparent"
													/>
													<span
														className={`w-[17px] h-[17px] rounded-[2px] border border-textSecondary flex items-center justify-center transition-colors duration-150 ${selectedPostArticle.includes(item.id)
															? "bg-primary !border-primary"
															: "bg-transparent"
															}`}
													>
														{selectedPostArticle.includes(item.id) && (
															<Icon
																icon="check"
																className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-[1px] mt-0.5 sm:ml-0.5"
															/>
														)}
													</span>
												</label>
											</td>
											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">
												{stripHTMLandDecodeEntities(item.title)}
											</td>

											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{item.type}</td>
											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{item.scheduledFor}</td>
											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base">
												<div className="truncate whitespace-nowrap overflow-hidden max-w-[250px]">
													{item.createdBy}
												</div>
											</td>

											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{item.createdOn}</td>

											<td className="flex items-center justify-between px-3 sm:px-5 py-4 text-xs sm:text-base whitespace-nowrap">
												<span className={`${item.statusColor}`}>{item.status}</span>
											</td>
											<td className="px-3 sm:px-5 py-4 sm:w-auto">
												<Menu as="div" className="sm:w-[72px] flex justify-center relative text-left">
													<Menu.Button>
														<Icon
															icon="action-icon"
															className="w-[11px] h-[11px] sm:w-5 sm:h-5 text-textSecondary dark:text-textDark"
														/>
													</Menu.Button>

													<Transition
														enter="transition ease-out duration-100"
														enterFrom="transform scale-95 opacity-0"
														enterTo="transform scale-100 opacity-100"
														leave="transition ease-in duration-75"
														leaveFrom="transform scale-100 opacity-100"
														leaveTo="transform scale-95 opacity-0"
													>
														<Menu.Items
															className={`absolute -right-5 w-[140px] sm:w-[163px] bg-fgc dark:bg-fgcDark rounded-xl focus:outline-none flex flex-col z-50 transition ${menuPositionClass}`}
														>
															<div className="flex flex-col items-start px-3 py-2 sm:px-2.5 sm:py-2.5 gap-1">
																<Menu.Item>
																	<div
																		className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																		onClick={() => {
																			const globalIndex = postArticle.findIndex((u) => u.id === item.id);
																			setEditIndex(globalIndex);
																			setIsAddEditPostArticlePopupOpen(true);
																		}}
																	>
																		Edit
																	</div>
																</Menu.Item>
																{item.status !== "Archived" && item.status !== "Draft" && (
																	<Menu.Item>
																		<div
																			className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																			onClick={() => {
																				setSelectedArchiveItem(item);
																				setIsArchivePopupOpen(true);
																			}}
																		>
																			Archive
																		</div>
																	</Menu.Item>
																)}
																<Menu.Item>
																	<div
																		className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																		onClick={() => {
																			setDeleteUserIndex(postArticle.findIndex((u) => u.id === item.id));
																			setIsDeleteUserPopupOpen(true);
																		}}
																	>
																		Delete
																	</div>
																</Menu.Item>
																{item.status === "Draft" && (
																	<Menu.Item>
																		<div
																			className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																			onClick={() => {
																				setSelectedItemId(item.id);

																				setShowScheduleConfirm(true);
																			}}
																		>
																			Publish
																		</div>
																	</Menu.Item>
																)}
															</div>
														</Menu.Items>
													</Transition>
												</Menu>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 sm:py-2.5 relative flex-[0_0_auto]">
					<div className="w-full flex items-center">
						<span className="text-xs sm:text-sm text-textSecondary leading-[18px] sm:leading-[24px]">
							{postArticle.length === 0
								? "Showing 0 of 0 Post / Article"
								: `Showing ${startIdx + 1}–${Math.min(endIdx, totalArticlesCount)} of ${totalArticlesCount} Post / Article`}
						</span>
					</div>
					{postArticle.length !== 0 && (
						<Pagination
							totalRecords={totalArticlesCount}
							recordsPerPage={PostArticlePerPage}
							currentPage={currentPage}
							handlePageChange={(page: number) => {
								setCurrentPage(page);
								fetchPaginatedArticles(page, sortConfig.key, sortConfig.direction);
							}}
						/>
					)}
				</div>
			</div>
			<div className="w-full flex lg:flex-row flex-col justify-between gap-6">
				<ArticleSelectionSection
					title="Top Stories"
					sectionKey="top"
					articleSelections={topStoriesSelections}
					getFilteredOptions={getFilteredOptions}
					handleSelectChange={handleSelectChange}
					onReset={() => {
						setTopStoriesSelections({});
						resetTop();
					}}
					onSave={handleSubmitTop(onSubmitTop)}
					errors={errorsTop}
				/>

				<ArticleSelectionSection
					title="Severe Weather"
					sectionKey="severe"
					articleSelections={severeWeatherSelections}
					getFilteredOptions2={getFilteredOptions2}
					handleSelectChange={handleSelectChange}
					onReset={() => {
						setSevereWeatherSelections({});
						resetSevere();
					}}
					onSave={handleSubmitSevere(onSubmitSevere)}
					errors={errorsSevere}
				/>

			</div>

			<AddEditPostArticlePopup
				isOpen={isAddEditPostArticlePopupOpen}
				setIsOpen={() => {
					setEditIndex(null);
					setIsAddEditPostArticlePopupOpen(false);
				}}
				list={postArticle}
				setList={setPostArticle}
				editIndex={editIndex}
			/>

			<ScheduleConfirmation
				isOpen={showScheduleConfirm}
				setIsOpen={setShowScheduleConfirm}
				itemType="article"
				onConfirm={() => {
					if (selectedItemId) {
						handleDraft(selectedItemId);
						setSelectedItemId(null);
					}
				}}
			/>

			{selectedArchiveItem && (
				<PostArticleArchivePopup
					isOpen={isArchivePopupOpen}
					setIsOpen={setIsArchivePopupOpen}
					user={null}
					onArchive={handleArchive}
					itemType="Post / Article"
				/>
			)}


			<DeleteUserPopup
				isOpen={isDeleteUserPopupOpen}
				setIsOpen={setIsDeleteUserPopupOpen}
				user={
					deleteUserIndex !== null
						? { name: postArticle[deleteUserIndex].title }
						: null
				}
				itemType={
					deleteUserIndex !== null
						? postArticle[deleteUserIndex].status === "Draft"
							? "Draft Post / Article" : "Post / Article"
						: ""
				}
				onDelete={() => {
					if (deleteUserIndex !== null) {
						deleteArticle();
						setDeleteUserIndex(null);
						setIsDeleteUserPopupOpen(false);
					}
				}}
			/>
		</div>
	);
}
