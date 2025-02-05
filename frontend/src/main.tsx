import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from "antd";


const myTheme = {
	token: {
		colorPrimary: "#0070f3",
		colorSecondary: "#ff0080",
		colorSuccess: "#00ff00",
		colorError: "#ff0000",
		colorWarning: "#ffae42",
		colorBackground: "#f0f0f0",
		colorCard: "#ffffff",
		colorText: "#000000",
		colorBorder: "#d9d9d9",
		colorNotification: "#ff0080",
	},
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ConfigProvider theme={myTheme}>
			<App />
		</ConfigProvider>
	</StrictMode>
);

