import React from "react";
import styles from "./AboutSection.module.scss";
import Logo from "../Logo";

const AboutSection = () => {
	return (
		<div className={styles.AboutSection}>
			<div className={styles.Row}>
				<div className={styles.Header}>
					<div className={styles.Title}>
						<div className={styles.Rectangle4} />
						<div className={styles.AboutTheSearchEngine}>About The Search Engine</div>
					</div>
					<div className={styles.ContentContainer}>
						<div className={styles.ContainerAlignment}>
							<div className={styles.WhyWeBuiltThis}>Why We Built This</div>
							<div className={styles.ContainerIndent}>
								<div className={styles.Paragraph}>As long-time viewers and supporters of Dr. K, we noticed that the wisdom spread across his videos could be hard to pinpoint when you need it most. This search engine was created to solve that problem, making it easier for everyone in the community to access valuable insights quickly and effectively.</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.ImageGroup}>
					<div className={styles.ImageContainer}>
						<img className={styles.Image19} src="./dr k confident.png" alt="Placeholder" />
						<div className={styles.Logo}>
							<Logo />
						</div>
					</div>
				</div>
			</div>
			<div className={styles.Row}>
				<img className={styles.DrkConfidentImage} src="./drk-confident-image2.png" alt="Placeholder" />
				<div className={styles.DiscordLoginContainer}>
					<div className={styles.DiscordLoginTitle}>Using Discord to Log In</div>
					<div className={styles.Container}>
						<div className={styles.DiscordLoginExplanation}>
							<span>
								To use this search engine, you will need to log in using your Discord account. We chose Discord login for several reasons:
								<br />
							</span>
							<span className={styles.BoldText}>Community-Centric</span>
							<span>
								: Many of Healthy Gamer’s viewers are already active on Discord, making it a familiar and accessible option.
								<br />
								Security: Discord provides a secure authentication system that helps protect your privacy and data.
								<br />
							</span>
							<span className={styles.BoldText}>Supporting the Platform</span>
							<span>: The costs associated with hosting our search engine and the AI technologies that power the searches are significant. By requiring a login, we can better manage these resources and ensure the sustainability of this free service to the community.</span>
						</div>
						<div className={styles.Actions}>
							<div className={styles.LoginButton}>
								<div className={styles.Login}>Login</div>
							</div>
							<div className={styles.FeedbackButton}>
								<div className={styles.ShareFeedback}>Share feedback</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.Row}>
				<div className={styles.WhoIsDrkContainer}>
					<div className={styles.Title}>Who is Dr. K?</div>
					<div className={styles.Container}>
						<div className={styles.Content}>
							<span>A Pioneer in Mental Health and Gaming. Dr. Alok Kanojia, better known as Dr. K, is a Harvard-trained psychiatrist and the visionary behind </span>
							<a href="https://www.healthygamer.gg/" className={styles.LinkText} target="_blank" rel="noopener noreferrer">
								Healthy Gamer GG
							</a>
							<span>
								. He specializes in issues at the intersection of video gaming and mental health, particularly affecting the gaming community. Through his YouTube channel, Healthy Gamer GG, Dr. K offers interviews, Q&A sessions, and discussions aimed at improving mental health awareness and providing support for gamers and others.
								<br />
								Dr. K's approach combines traditional psychiatric knowledge with an in-depth understanding of the gaming culture, making his advice not only medically relevant but also culturally resonant with his audience.
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutSection;