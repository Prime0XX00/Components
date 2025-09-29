import Body from "./layout/Body";
import LightingModeProvider from "./context/LightingMode";
import Sidebar from "./layout/Sidebar";

function App() {
	return (
		<>
			<LightingModeProvider>
				<Body></Body>
				<Sidebar></Sidebar>
			</LightingModeProvider>
		</>
	);
}

export default App;
