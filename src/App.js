import React, { useState } from "react";
import Header from "./components/Header";
// import Home from "./components/Home";
import NetworkModal from "./components/NetworkModal";
import UploadCSV from "./components/UploadCSV";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

const App = () => {
	const [switchNetwork, setSwitchNetwork] = useState(false);

	return (
		<>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
				<NetworkModal open={switchNetwork} setOpen={setSwitchNetwork} />
				<Header />
				<UploadCSV />
				{/* <Home /> */}
			</ThemeProvider>
		</>
	);
};

export default App;
