import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "./NavBar.module.scss";
import Logo from "./Logo2";
import { FaDiscord } from "react-icons/fa";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";

import app from "../firebase";
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

	useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
			if (user) {
				// User is signed in, use the user object for user's info.
				console.log("User is signed in or token was refreshed:", user);
			} else {
				// User is signed out.
				console.log("User is signed out");
        axios
          .post("/auth/token/")
          .then((response: any) => {
            const token = response.data.access_token;
            signInWithCustomToken(auth, token).then((user) => console.log(user)).catch(function (error: any) {
              console.log(error);
              if (error.code === "auth/token-expired") {
                // Display a message to the user that their session has expired and prompt them to log in again.
                console.log("Session has expired, please log in again.");
                // Redirect or handle the re-authentication flow
              }
            });
          })
          .catch((error) => {
            console.error("Token exchange failed", error);
            setError("Failed to login with Discord.");
          });
			}
		});

		// Clean up the subscription on unmount
		return () => unsubscribe();
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
