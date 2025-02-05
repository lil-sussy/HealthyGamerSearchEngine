import React from 'react';
import { useState, useEffect } from "react";
import logo from "./logo.svg";
import { onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import app, { auth } from "./firebase.ts";
import axios from "axios";
import Navbar from "./components/ui/Navbar.tsx";
import HeroHeader from "./components/ui/HeroHeader.tsx";
import AboutSection from "./components/ui/AboutSection.tsx";
import HowItWorksSection from "./components/ui/HowitworksSection.tsx";
import ContactSection from "./components/ui/ContactSection.tsx";
import Background from "./components/Background.tsx";

function App() {
	const [idToken, setIdToken] = useState("");

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in, retrieve the ID token
				user.getIdToken(true).then(function (idToken: string) {
					setIdToken(idToken);
				});
			} else {
				// User is signed out
				console.log("No user is signed in.");
			}
		});
	}, []);

	useEffect(() => {
		axios
			.post("/auth/token/")
			.then((response: any) => {
				const token = response.data.access_token;
				signInWithCustomToken(auth, token)
					.then((user) => {
						auth.currentUser!.getIdToken(true).then(async function (idToken) {
							setIdToken(idToken);
						});
					})
					.catch(function (error: any) {
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
			});
		const unsubscribe = auth.onAuthStateChanged((user: any) => {
			if (user) {
				// User is signed in, use the user object for user's info.
				console.log("User is signed in or token was refreshed:", user);
				auth.currentUser!.getIdToken(true).then(async function (idToken) {
					setIdToken(idToken);
				});
			} else {
				// User is signed out.
				console.log("User is signed out, attempt loggin in");
			}
		});

		// Clean up the subscription on unmount
		return () => unsubscribe();
	}, []);

	return (
		<>
			<div className="App relative">
				{/* <Navbar /> */}
				<HeroHeader idToken={idToken} />
				<AboutSection />
				<HowItWorksSection />
				<ContactSection />
				<Background />
			</div>
		</>
	);
}

export default App;
