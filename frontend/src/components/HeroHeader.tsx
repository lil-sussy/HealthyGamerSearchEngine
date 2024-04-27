import React from "react";
import Logo from "./Logo";
import "./HeroHeader.scss";

function HeroHeader() {
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
            <div className="SearchBarContainer">
              <div className="SearchBar">
                <div className="PlaceHolderContainer">
                  <div className="SearchLogo">
                  </div>
                  <div className="Placeholder">What’s on your mind...</div>
                </div>
              </div>
              <div className="search-button">
                <div className="SearchLogo small">
                </div>
              </div>
            </div>
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
}

export default HeroHeader;
