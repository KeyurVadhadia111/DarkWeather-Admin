import { useNavigate } from "react-router-dom";

function AccessDisabled() {
	const navigate = useNavigate();
	/* useEffect(() => {
		if (import.meta.env.VITE_ALLOW_WEB === "true") {
			navigate("/");
		}

		return () => {
			true;
		}
	}, [import.meta.env.VITE_ALLOW_WEB]) */

	const channelName = import.meta.env.VITE_BOT_URL || "https://t.me/clickcity_dev_bot";

	return (
		<div>
			<div className="flex flex-col items-center justify-center min-h-screen">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold">Play ClickCity on your mobile</h1>
					<p className="mt-2 text-lg">Use your camera to scan the QR code below</p>
				</div>

				<div className="p-4 rounded-2xl bg-bgc">
					{/* <img
                        src="https://via.placeholder.com/200"
                        alt="QR Code"
                        className="w-48 h-48"
                    /> */}
					<img
						src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${channelName}`}
						alt="QR Code"
						className="w-56 h-56"
					/>
				</div>

				<a
					href={channelName.replace("/ClickCity", "").replace("/game", "")}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-4 text-lg font-medium">
					@CLICK_CITY_BOT
				</a>
				{/* <div className="mt-5">Platform</div> */}
			</div>
			{/* <div
                className={cn(
                    "xs:grid-cols-12",
                    "grid",
                    "h-screen",
                    "sm:grid-cols-12",
                    "md:grid-cols-12",
                    "lg:grid-cols-12",
                    "xl:grid-cols-12",
                )}>
                <div className="col-span-12 animate-fade ">
                    <div
                        className={cn(
                            "relative",
                            "flex",
                            "min-h-full",
                            "items-center",
                            "justify-center",
                            "px-4",
                            "py-12",
                            "sm:px-6",
                            "lg:px-8",
                        )}>
                        <div className="w-full max-w-md space-y-6">
                            <div className="mb-10">
                                <div className="flex justify-center">
                                    <Icon icon="info-circle" className="w-28 h-28 text-red-300" />
                                </div>
                                <h2
                                    className={cn(
                                        "mt-6",
                                        "text-center",
                                        "text-3xl",
                                        "font-extrabold",
                                        "tracking-tight",
                                    )}>
                                    Access disabled
                                </h2>
                            </div>

                            <div className="-space-y-px rounded-md">
                                <p className="grid grid-cols-1 gap-3 text-center text-sm font-normal leading-5">
                                    Site access has been temporarily disabled. Please
                                    contact admin for more details regarding this.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
		</div>
	);
}

export default AccessDisabled;
