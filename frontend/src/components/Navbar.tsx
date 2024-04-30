import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "./NavBar.module.scss";
import Logo from "./Logo2";
import { FaDiscord } from "react-icons/fa";


const NavBar = () => {
	const [error, setError] = useState("");
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");

	const discordClientId = "1234460436745949185"; // Replace with your Discord Client ID
  let redirect;
  if (window.location.hostname === "localhost") {
    redirect = "http://localhost:8000"; // Update according to your redirect URI
  } else {
    redirect = "https://"+window.location.hostname; // Update according to your redirect URI
  }
  redirect += "/auth/callback/discord"
	const redirectUri = encodeURIComponent(redirect); // Update according to your redirect URI

	const handleLogin = () => {
		const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;
		window.location.href = discordAuthUrl; // Redirect user to Discord login
	};

	useEffect(() => {
		if (code) {
			// Call an API endpoint on your server to handle the OAuth token exchange
			axios
				.post("/api/exchange-token", { code })
				.then((response) => console.log("Token exchange successful", response.data))
				.catch((error) => {
					console.error("Token exchange failed", error);
					setError("Failed to login with Discord.");
				});
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
