import { createContext, useState, type ReactNode } from "react";

interface LightingModeContextProps {
	mode: string;
	toggle: () => void;
}

interface LightingModeProviderProps {
	children?: ReactNode;
}

export const LIGHTMODE = "LIGHT";
export const DARKMODE = "DARK";

export const LightingModeContext =
	createContext<LightingModeContextProps | null>(null);

const LightingModeProvider = ({ children }: LightingModeProviderProps) => {
	const [lightingMode, setLightingMode] = useState(
		localStorage.getItem("lightingMode") ?? LIGHTMODE
	);

	const handleToggleLightingMode = () => {
		setLightingMode(lightingMode == LIGHTMODE ? DARKMODE : LIGHTMODE);
		localStorage.setItem(
			"lightingMode",
			lightingMode == LIGHTMODE ? DARKMODE : LIGHTMODE
		);
	};

	if (lightingMode == LIGHTMODE) {
		document.documentElement.classList.remove("dark");
	} else if (lightingMode == DARKMODE) {
		document.documentElement.classList.add("dark");
	}

	const lightingModeValue = {
		mode: lightingMode,
		toggle: handleToggleLightingMode,
	};

	return (
		<LightingModeContext.Provider value={lightingModeValue}>
			{children}
		</LightingModeContext.Provider>
	);
};

export default LightingModeProvider;
