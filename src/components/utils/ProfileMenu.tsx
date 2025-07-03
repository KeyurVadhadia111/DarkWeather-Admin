import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import useAppState from "./useAppState";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface Props { }

const ProfileMenu: React.FC<Props> = () => {
	const isDark = useAppState(state => state.isDark);
	const userDetails = useAppState(state => state.userDetails);
	const setUserDetails = useAppState(state => state.setUserDetails);

	const navigate = useNavigate();

	return (
		<Menu as="div" className="relative">
			<div>
				<MenuButton className="relative flex rounded-full bg-text text-sm focus:ring-0 focus:outline-hidden cursor-pointer w-[52px] h-[52px] ring-1 ring-text">
					<img alt="" src="/assets/images/user.png" className="w-[52px] h-[52px] rounded-full" />
				</MenuButton>
			</div>
			<MenuItems
				modal={false}
				transition
				anchor="bottom end"
				className="absolute right-0 z-10 mt-3 w-48 origin-top-right rounded-md bg-bgc dark:bg-fgcDark py-2 shadow-[0_20px_35px_rgba(0,0,0,0.05)] ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in [--anchor-gap:4px] sm:[--anchor-gap:8px]">
				<MenuItem>
					<a
						href="#"
						className="block px-4 py-2 text-sm text-text dark:text-textDark data-focus:bg-gray-100 data-focus:outline-hidden hover:bg-bgc dark:hover:bg-bgcDark"
						onClick={() => {
							localStorage.removeItem("auth");
							setUserDetails({});
							navigate("/login");
						}}>
						Logout
					</a>
				</MenuItem>
			</MenuItems>
		</Menu>
	);
};

export default ProfileMenu;
