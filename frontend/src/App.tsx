import React from 'react';
import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import app, { auth } from "./firebase.ts";
import axios from "axios";
import HeroHeader from "./components/ui/HeroHeader.tsx";
import Navbar from "./components/ui/Navbar.tsx";
import AboutSection from "./components/ui/AboutSection.tsx";
import HowItWorksSection from "./components/ui/HowitworksSection.tsx";
import ContactSection from "./components/ui/ContactSection.tsx";
import Background from "./components/Background.tsx";
import { User } from "firebase/auth";

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
			.post<{ access_token: string }>("/auth/token/")
			.then((response) => {
				const token = response.data.access_token;
				signInWithCustomToken(auth, token)
					.then((userCredential) => {
						const user = userCredential.user;
						user.getIdToken(true).then((idToken: string) => {
							setIdToken(idToken);
						});
					})
					.catch((error: Error) => {
						console.log(error);
						if (error.message.includes("token-expired")) {
							console.log("Session has expired, please log in again.");
						}
					});
			})
			.catch((error: Error) => {
				console.error("Token exchange failed", error);
			});

		const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
			if (user) {
				user.getIdToken(true).then((idToken: string) => {
					setIdToken(idToken);
				});
			} else {
				console.log("User is signed out, attempt logging in");
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<>
			<div className="App relative">
				<Navbar />
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
