const { nextui } = require("@nextui-org/react");

module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#0070f3",
				secondary: "#ff0080",
				success: "#00ff00",
				error: "#ff0000",
				warning: "#ffae42",
				background: "#f0f0f0",
				card: "#ffffff",
				text: "#000000",
				border: "#d9d9d9",
				notification: "#ff0080",
			},
		},
	},
	darkMode: "class",
	plugins: [nextui()],
};
