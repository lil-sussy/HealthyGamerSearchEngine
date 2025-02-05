/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#24c52a",
				secondary: "#ba40fd",
				success: "#24c52a",
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
	plugins: [],
	corePlugins: {
		preflight: false, // Disables Tailwind's base reset
	},
};