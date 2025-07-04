import Icon from "components/utils/Icon";
import { Menu, Transition } from "@headlessui/react";
import Pagination from "components/utils/Pagination";
import { Button } from "components/utils/Button";

interface AdminAlertsType {
	id: number;
	alertType: string;
	description: string;
	triggeredOn: string;
	severity: string;
}

interface SortConfig {
	key: keyof AdminAlertsType;
	direction: "asc" | "desc";
}

type Props = {
	item: AdminAlertsType[]
	handleSort: (key: keyof AdminAlertsType) => void;
	sortConfig: SortConfig;
	filteredAdminAlerts: any;
	startIdx: any;
	endIdx: any;
	PostArticlePerPage: any;
	currentPage: any;
	setCurrentPage: any;
	setDeleteUserIndex: any;
	setIsDeleteUserPopupOpen: any;
	adminAlerts: any;
};

const AdminAlerts: React.FC<Props> = ({ item = [], handleSort, sortConfig, filteredAdminAlerts, startIdx, endIdx, PostArticlePerPage, currentPage, setCurrentPage, setDeleteUserIndex, setIsDeleteUserPopupOpen, adminAlerts }) => {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col w-full items-start gap-4 p-4 relative bg-bgc dark:bg-bgcDark rounded-2xl shadow-[0px_10px_65px_#0000000d]">
				<div className="w-full overflow-x-auto overflow-hidden">
					<table className="min-w-[950px] sm:min-w-[130px] w-full text-left border-separate border-spacing-0">
						<thead>
							<tr className="h-[42px] sm:h-[52px] bg-fgc dark:bg-fgcDark rounded-xl">
								<th className="w-[152px] sm:w-[260px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("alertType")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Alert Type</span>
										<Icon
											icon={sortConfig?.key === "alertType" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[95px] sm:w-[140px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("description")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Description</span>
										<Icon
											icon={sortConfig?.key === "description" ? "up-sort" : "sort"}
											className={`w-4 h-4 sm:w-5 sm:h-5 text-text dark:text-textDark shrink-0 ${sortConfig.direction === "asc" ? "" : "rotate-180"
												}`}
										/>
									</div>
								</th>
								<th className="w-[180px] sm:w-[220px] px-3 sm:px-5 py-3.5">
									<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">Triggered On</span>
								</th>
								<th className="w-[137px] sm:w-[180px] px-3 sm:px-5 py-3.5 cursor-pointer" onClick={() => handleSort("severity")}>
									<div className="flex items-center gap-2">
										<span className="text-text dark:text-textDark text-xs sm:text-base font-medium whitespace-nowrap">
											Severity
										</span>
										<Icon
											icon={sortConfig?.key === "severity" ? "up-sort" : "sort"}
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
												{item.alertType}
											</td>

											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{item.description}</td>
											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base whitespace-nowrap">{item.triggeredOn}</td>
											<td className="px-3 sm:px-5 py-4 text-text dark:text-textDark text-xs sm:text-base">
												<div className="truncate whitespace-nowrap overflow-hidden max-w-[250px]">
													{item.severity}
												</div>
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
															className={`absolute -right-5 w-[140px] sm:w-[163px] bg-fgc dark:bg-fgcDark rounded-xl focus:outline-none flex flex-col z-50 transition ${menuPositionClass}`}
														>
															<div className="flex flex-col items-start px-3 py-2 sm:px-2.5 sm:py-2.5 gap-1">
																<Menu.Item>
																	<div
																		className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																	// onClick={() => {
																	// 	const globalIndex = PostArticle.findIndex((u) => u.id === item.id);
																	// 	setEditIndex(globalIndex);
																	// 	setIsAddEditPostArticlePopupOpen(true);
																	// }}
																	>
																		Edit
																	</div>
																</Menu.Item>
																<Menu.Item>
																	<div
																		className="flex p-1 sm:px-3 sm:py-2.5 items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-textDark cursor-pointer w-full"
																		onClick={() => {
																			setDeleteUserIndex(
																				adminAlerts.findIndex((u: any) => u.id === item.id));
																			setIsDeleteUserPopupOpen(true);
																		}}
																	>
																		Delete
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
							{filteredAdminAlerts.length === 0
								? "Showing 0 of 0 Post / Article"
								: `Showing ${startIdx + 1}–${Math.min(endIdx, filteredAdminAlerts.length)} of ${filteredAdminAlerts.length} Post / Article`}
						</span>
					</div>
					{filteredAdminAlerts.length !== 0 && (
						<Pagination
							totalRecords={filteredAdminAlerts.length}
							recordsPerPage={PostArticlePerPage}
							currentPage={currentPage}
							handlePageChange={(page: number) => {
								setCurrentPage(page);
							}}
						/>
					)}
				</div>
			</div>
			<div className="flex flex-col gap-4 w-full bg-[#F8F8F8] dark:bg-bgcDark rounded-xl p-4">
				<span className="text-text dark:text-textDark font-medium">Choose Delivery Channel</span>
				<div className="flex items-start gap-4 w-fit">
					<label
						className="relative flex items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer w-full"
					>
						<input
							type="checkbox"
							// {...register(`access.${key}` as Path<FormData>)}
							className="peer hidden"
						/>

						<span
							className="
																w-4 h-4 rounded-md border border-[#808080] dark:border-white
																flex items-center justify-center
																bg-transparent
																peer-checked:bg-[#FFA500] peer-checked:border-[#FFA500]
																relative
															"
						>
						</span>
						<svg
							className="
																	w-3 h-3 text-black
																	absolute left-0.5
																	opacity-0 peer-checked:opacity-100
																	transition-opacity duration-150 ease-in-out
																	pointer-events-none
																"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						Slack
					</label>
					<label
						className="relative flex items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer w-full"
					>
						<input
							type="checkbox"
							// {...register(`access.${key}` as Path<FormData>)}
							className="peer hidden"
						/>

						<span
							className="
																w-4 h-4 rounded-md border border-[#808080] dark:border-white
																flex items-center justify-center
																bg-transparent
																peer-checked:bg-[#FFA500] peer-checked:border-[#FFA500]
																relative
															"
						>
						</span>
						<svg
							className="
																	w-3 h-3 text-black
																	absolute left-0.5
																	opacity-0 peer-checked:opacity-100
																	transition-opacity duration-150 ease-in-out
																	pointer-events-none
																"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						Email
					</label>
					<label
						className="relative flex items-center gap-2 text-sm sm:text-base text-textSecondary dark:text-white cursor-pointer w-full"
					>
						<input
							type="checkbox"
							// {...register(`access.${key}` as Path<FormData>)}
							className="peer hidden"
						/>

						<span
							className="
																w-4 h-4 rounded-md border border-[#808080] dark:border-white
																flex items-center justify-center
																bg-transparent
																peer-checked:bg-[#FFA500] peer-checked:border-[#FFA500]
																relative
															"
						>
						</span>
						<svg
							className="
																	w-3 h-3 text-black
																	absolute left-0.5
																	opacity-0 peer-checked:opacity-100
																	transition-opacity duration-150 ease-in-out
																	pointer-events-none
																"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						SMS
					</label>
				</div>
			</div>
			<div className="flex justify-end gap-3">
				<Button
					type="button"
					className="text-sm sm:text-base w-auto px-6 !py-[10.3px] sm:!py-[15.1px] border border-text dark:border-bgc rounded-xl font-semibold text-text dark:text-textDark bg-transparent hover:!bg-transparent"
				// onClick={() => setIsOpen(false)}
				>
					Reset
				</Button>
				<Button
					type="submit"
					className="text-sm sm:text-base w-auto px-6 !py-[10.3px] sm:!py-[15.1px] bg-primary rounded-xl font-semibold text-text">
					save
				</Button>
			</div>
		</div>
	);

}

export default AdminAlerts;
