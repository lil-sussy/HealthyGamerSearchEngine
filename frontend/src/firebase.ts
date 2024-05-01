import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyChwnB10P4HzmU8Akb37ed9ImwAKr-tsAY",
	authDomain: "healthy-gamer-search-engine.firebaseapp.com",
	projectId: "healthy-gamer-search-engine",
	storageBucket: "healthy-gamer-search-engine.appspot.com",
	messagingSenderId: "884741471197",
	appId: "1:884741471197:web:0f84ef5dbe86f2804a9434",
	measurementId: "G-6D67Q8438T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase App

// Get Auth instance
export default app;