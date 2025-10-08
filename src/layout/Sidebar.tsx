import { useContext } from "react";
import { FaGithub } from "react-icons/fa";
import { LightingModeContext, LIGHTMODE } from "../context/LightingMode";
import { LuMoon, LuSun } from "react-icons/lu";

const Sidebar = () => {
	const { mode, toggle } = useContext(LightingModeContext) ?? {};

	return (
		<div className="flex  fixed top-0 left-1/2 -translate-x-1/2 lg:left-0 lg:flex-col lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0">
			<a
				href="https://github.com/Prime0XX00/Components"
				className="
			 bg-(--primary-bg) text-(--primary-fg) p-2 w-fit h-fit cursor-pointer hover:rounded-b-(--rounded) hover:pt-5 lg:hover:rounded-r-(--rounded) lg:hover:pl-5 transition-all"
			>
				<FaGithub size={40} />
			</a>
			<div
				onClick={() => toggle?.()}
				className="
			 bg-(--opposite-bg) text-(--opposite-fg) p-2 w-fit h-fit cursor-pointer hover:rounded-b-(--rounded) hover:pt-5 lg:hover:rounded-r-(--rounded) lg:hover:pl-5 transition-all"
			>
				{mode == LIGHTMODE ? <LuSun size={40} /> : <LuMoon size={40} />}
			</div>
		</div>
	);
};

export default Sidebar;
