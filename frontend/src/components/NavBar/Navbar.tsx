import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "./NavBar.module.scss";
import Logo from "../Logo2";
import { FaDiscord } from "react-icons/fa";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { FaBars, FaTimes } from "react-icons/fa";

import app from "../../firebase";
const auth = getAuth(app)


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

  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

	const toggleBurgerMenu = () => {
		setIsBurgerOpen(!isBurgerOpen);
	};

	return (
		<div className={styles.Navbar}>
			<div className={styles.BurgerIcon} onClick={toggleBurgerMenu}>
				{isBurgerOpen ? <FaTimes /> : <FaBars />}
			</div>
			<div className={styles.LogoContainer}>
				<Logo />
				<span className={styles.Title}>HGG AI</span>
			</div>
			<div className={`${styles.NavigationButtons} ${isBurgerOpen ? styles.Show : ""}`}>
				<div className={`${styles.Button} ${styles.Search}`}>Search</div>
				<div className={`${styles.Button} ${styles.About}`}>About</div>
				<div className={`${styles.Button} ${styles.HowItWorks}`}>How it works</div>
				<div className={`${styles.Button} ${styles.Contact}`}>Contact</div>
				<div onClick={handleLogin} className={`${styles.Button} ${styles.ButtonDiscord} ${styles.Login}`}>
					<FaDiscord />
					<p>Login</p>
				</div>
				{error && <p className={styles.Error}>{error}</p>}
			</div>
		</div>
	);
};

export default NavBar;
