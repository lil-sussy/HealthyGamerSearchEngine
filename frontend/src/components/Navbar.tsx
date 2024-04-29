import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "./NavBar.module.scss";
import Logo from "./Logo2";
import { FaDiscord } from "react-icons/fa";

const NavBar = () => {
	const [error, setError] = useState("");

	const discordClientId = "1234460436745949185"; // Replace with your Discord Client ID
	const redirectUri = encodeURIComponent(process.env.CALLBACK_DISCORD_URL!); // Update according to your redirect URI

	const handleLogin = () => {
		const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;
		window.location.href = discordAuthUrl; // Redirect user to Discord login
	};

	const handleCallback = async (code: string) => {
		try {
			const params = new URLSearchParams();
			params.append("client_id", discordClientId);
			params.append("client_secret", process.env.DISCORD_SECRET? process.env.DISCORD_SECRET : "no secret xd"); // Ensure this is securely managed
			params.append("grant_type", "authorization_code");
			params.append("code", code);
			params.append("redirect_uri", decodeURIComponent(redirectUri));

			const response = await axios.post("https://discord.com/api/oauth2/token", params.toString(), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			console.log("Access Token:", response.data.access_token);
		} catch (err) {
			console.error(err);
			setError("Failed to login with Discord.");
		}
	};

  const [searchParams] = useSearchParams();
	const code = searchParams.get("code");
  useEffect(() => {
		if (code) {
			// Call an API endpoint on your server to handle the OAuth token exchange
			axios
				.post("/api/exchange-token", { code })
				.then((response) => console.log("Token exchange successful"))
				.catch((error) => console.error("Token exchange failed", error));
		}
	}, [code]);

	return (
		<div className={styles.Navbar}>
			<Logo />
			<div className={styles.NavigationButtons}>
				<div className={`${styles.Button} ${styles.Search}`}>Search</div>
				<div className={`${styles.Button} ${styles.About}`}>About this</div>
				<div className={`${styles.Button} ${styles.HowItWorks}`}>How it works</div>
				<div className={`${styles.Button} ${styles.Contact}`}>Contact</div>
				<button onClick={handleLogin} className={`${styles.Button} ${styles.Login}`}>
					<FaDiscord /> Log in with Discord
				</button>
				{error && <p className={styles.Error}>{error}</p>}
			</div>
		</div>
	);
};

export default NavBar;
