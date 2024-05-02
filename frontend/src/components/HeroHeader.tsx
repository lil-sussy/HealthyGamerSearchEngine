import Logo from "./Logo";
import "./HeroHeader.scss";
import React, { useEffect, useState } from "react";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, getIdToken , onAuthStateChanged } from "firebase/auth";
import type { Video, Occurrence } from "./Videos";
import { VideoResultDisplay } from "./Videos";

import app from "../firebase";
const auth = getAuth(app);

const HeroHeader = ({ idToken }: { idToken: string }) => {
	const [query, setQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [results, setResults] = useState<Video[]>([]);

	const handleInputChange = (event: any) => {
		setQuery(event.target.value);
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		if (!query.trim()) return;

		try {
      const response = await fetch("/api/query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ query: query }),
      });
      const data = await response.json();
      if (response.ok) {
        setResponseMessage("");
        setResults(data.results);
      } else {
        setResponseMessage(`Error: ${data.message || JSON.stringify(data)}`);
      }
		} catch (error) {
      //@ts-ignore
			setResponseMessage(`Error: ${error.message}`);
		}
	};
	return (
		<div className="HeroHeaderContainer">
			<div className="HeroHeader">
				{/* <div className="PurpleBlur" />
				<div className="GreenBlur" /> */}
				<div className="DrKImageContainer">
					<img className="Image7" src="./drkStaring.png" alt="Placeholder" />
					<div className="Logo">
						<Logo />
					</div>
				</div>
				<div className="RightContent">
					<div className="UnofficialHealthyGamerGgSearchEngine">
						<span className="text-black">Unofficial Healthy Gamer GG </span>
						<span className="text-green">Search Engine</span>
					</div>
					<div className="Frame13">
						<form className="SearchBarContainer" onSubmit={handleSubmit}>
							<div className="SearchBar">
								<div className="PlaceHolderContainer">
									<div className="SearchLogo"></div>
									<input type="text" className="Placeholder" placeholder="What’s on your mind..." value={query} onChange={handleInputChange} />
								</div>
							</div>
							<button className="search-button" type="submit">
								<div className="SearchLogo small"></div>
							</button>
						</form>
						{responseMessage && <div className="response-message">{responseMessage}</div>}
            {responseMessage.length === 0 && results.length > 0 ? 
              <div className="results">
                {results.map((video: Video, index: number) => (
                  <VideoResultDisplay key={index} video={video} />
                ))}
              </div>
            : <></>}
						<div className="indent-container">
							<div className="WelcomeText">Welcome to the Unofficial Healthy Gamer GG Search Engine, a dedicated tool designed by fans for fans. This platform allows you to navigate through the extensive content of Dr. K's videos to find specific advice, insights, and discussions tailored to your mental health and wellness needs.</div>
							<div className="Actions">
								<div className="Donate">Donate</div>
								<div className="ShareFeedback">Share feedback</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeroHeader;
