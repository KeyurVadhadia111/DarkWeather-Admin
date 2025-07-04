import Icon from "components/utils/Icon";
import { Menu, Transition } from "@headlessui/react";
import Pagination from "components/utils/Pagination";
import { Button } from "components/utils/Button";

interface ManageTemplatesType {
	id: number;
	templateName: string;
	channel: string;
	triggerEvent: string;
	fileName: string;
	status: string;
	statusColor: string;
}

interface SortConfig {
	key: keyof ManageTemplatesType;
	direction: "asc" | "desc";
}

type Props = {
	item: ManageTemplatesType[]
	handleSort: (key: keyof ManageTemplatesType) => void;
	sortConfig: SortConfig;
	filteredManageTemaplate: any;
	startIdx: any;
	endIdx: any;
	PostArticlePerPage: any;
	currentPage: any;
	setCurrentPage: any;
	setDeleteUserIndex: any;
	setIsDeleteUserPopupOpen: any;
	manageTemplates: any;
	setEditIndex: any;
	setIsAddEditManageTemplatePopup: any;
	setIsAddEditManageTemplatePopupOpen: any;
};

const ManageTemplates: React.FC<Props> = ({ item = [], handleSort, sortConfig, filteredManageTemaplate, startIdx, endIdx, PostArticlePerPage, currentPage, setCurrentPage, setDeleteUserIndex, setIsDeleteUserPopupOpen, manageTemplates, setEditIndex, setIsAddEditManageTemplatePopup, setIsAddEditManageTemplatePopupOpen }) => {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-5 border border-border dark:border-borderDark p-4 rounded-2xl">
				<div className="flex flex-col md:flex-row md:gap-0 gap-5 md:h-14 justify-between items-start md:items-center w-full">
					<div className="relative font-medium text-text dark:text-textDark text-xl sm:text-2xl tracking-[0] leading-5 sm:leading-6">
						Manage Push/Email/SMS Templates
					</div>
					<Button
						className="flex h-[42px] sm:h-14 items-center justify-center gap-3 sm:px-6 py-3 sm:py-4 relative flex-[0_0_auto] bg-primary rounded-lg sm:rounded-xl"
						onClick={() => {
							setEditIndex(null);
							setIsAddEditManageTemplatePopup(true);
						}}
					>
						<Icon icon="plus" className="w-5 h-5 sm:w-7 sm:h-7" />
						<div className="relative  font-semibold text-text text-xs sm:text-base tracking-[0] leading-6 whitespace-nowrap">
							Add New Template
						</div>
					</Button>
				</div>
				<div className="flex flex-col w-full items-start gap-4 p-4 relative bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
					<div className="w-full overflow-x-auto overflow-hidden">
						<table className="min-w-[950px] sm:min-w-[130px] w-full text-left border-separate border-spacing-0">
							<thead>
								<tr className="h-[42px] sm:h-[52px] bg-fgc dark:bg-fgcDark rounded-xl">
									<th className="w-[152px] sm:w-[260px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("templateName")}>
										<div className="flex items-center gap-2">
											<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Template Name</span>
											<Icon
												icon={sortConfig?.key === "templateName" ? "up-sort" : "sort"}
												className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
													}`}
											/>
										</div>
									</th>
									<th className="w-[95px] sm:w-[140px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("channel")}>
										<div className="flex items-center gap-2">
											<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Channel</span>
											<Icon
												icon={sortConfig?.key === "channel" ? "up-sort" : "sort"}
												className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
													}`}
											/>
										</div>
									</th>
									<th className="w-[180px] sm:w-[220px] px-3 sm:px-5 py-3.5">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Trigger Event</span>
									</th>
									<th className="w-[137px] sm:w-[180px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("fileName")}>
										<div className="flex items-center gap-2">
											<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">
												File Name
											</span>
											<Icon
												icon={sortConfig?.key === "fileName" ? "up-sort" : "sort"}
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
									<th className="flex justify-center w-[72px] sm:w-[110px] px-3 sm:px-5 py-3.5">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Actions</span>
									</th>
								</tr>
							</thead>

							<tbody>
								{item.length === 0 ? (
									<tr>
										<td colSpan={9} className="text-center py-11 text-textSecondary dark:text-textDark text-base sm:text-lg">
											No data found
										</td>
									</tr>
								) : (
									item.map((item: any, idx) => {
										const isLastFour = item.length >= 7 && idx >= item.length - 4;
										const menuPositionClass = isLastFour
											? "origin-bottom-right bottom-full mb-2.5 sm:mb-[17px]"
											: "origin-top-right top-full mt-2.5 sm:mt-[17px]";
										return (
											<tr key={item.id} className="h-8 sm:h-11">
												<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">
													{item.templateName}
												</td>

												<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{item.channel}</td>
												<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{item.triggerEvent}</td>
												<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base">
													<div className="truncate whitespace-nowrap overflow-hidden max-w-[250px]">
														{item.fileName}
													</div>
												</td>
												<td className="flex items-center justify-between px-3 sm:px-5 py-4 text-xs sm:text-base whitespace-nowrap">
													<span className={`${item.statusColor}`}>{item.status}</span>
												</td>
												<td className="px-3 sm:px-5 py-4 w-[72px] sm:w-[110px]">
													<Menu as="div" className="w-[40px] sm:w-[60px] flex justify-center relative">
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
																className={`absolute -right-5 w-[140px] sm:w-[190px] bg-fgc dark:bg-fgcDark rounded-xl focus:outline-none flex flex-col z-50 transition ${menuPositionClass}`}
															>
																<div className="flex flex-col items-start px-3 py-2 sm:px-2.5 sm:py-2.5 gap-1">
																	<Menu.Item>
																		<div
																			className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																			onClick={() => {
																				const globalIndex = manageTemplates.findIndex((u: any) => u.id === item.id);
																				setEditIndex(globalIndex);
																				setIsAddEditManageTemplatePopupOpen(true);
																			}}
																		>
																			Edit
																		</div>
																	</Menu.Item>
																	<Menu.Item>
																		<div
																			className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																			onClick={() => {
																				setDeleteUserIndex(manageTemplates.findIndex((u: any) => u.id === item.id));
																				setIsDeleteUserPopupOpen(true);
																			}}
																		>
																			Delete
																		</div>
																	</Menu.Item>
																	<Menu.Item>
																		<div
																			className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																		// onClick={() => {
																		// 	setDeleteUserIndex(PostArticle.findIndex((u) => u.id === item.id));
																		// 	setIsDeleteUserPopupOpen(true);
																		// }}
																		>
																			Download Template
																		</div>
																	</Menu.Item>
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
								{filteredManageTemaplate.length === 0
									? "Showing 0 of 0 Post / Article"
									: `Showing ${startIdx + 1}–${Math.min(endIdx, filteredManageTemaplate.length)} of ${filteredManageTemaplate.length} Post / Article`}
							</span>
						</div>
						{filteredManageTemaplate.length !== 0 && (
							<Pagination
								totalRecords={filteredManageTemaplate.length}
								recordsPerPage={PostArticlePerPage}
								currentPage={currentPage}
								handlePageChange={(page: number) => {
									setCurrentPage(page);
								}}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);

}

export default ManageTemplates;
