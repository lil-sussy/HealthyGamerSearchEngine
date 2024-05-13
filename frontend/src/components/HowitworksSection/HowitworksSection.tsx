import React from "react";
import styles from "./HowitworksSection.module.scss";
import { AiCloudIcon, ShieldIcon, GlassIcon, TVIcon, RocketIcon } from "./Logo";

const HowItWorksSection = () => {
	return (
		<div className={styles.HowItWorksSection}>
			<div className={styles.FirstElementWithTitle}>
				<div className={styles.UnderlineColorGreen} />
				<div className={styles.SectionTitle}>How It Works</div>
      </div>
      <div className={styles.FirstElement}>
        <div className={styles.Icon}>
          <AiCloudIcon />
        </div>
        <div className={styles.Container}>
          <div className={styles.Title}>Data Privacy and Usage</div>
          <div className={styles.ContentContainer}>
            <div className={styles.Content}>
              Your privacy is paramount to us. The data collected is entirely anonymous and used exclusively to enhance the functionality and performance of the search engine. This information is not linked to your Discord account and is securely protected against third-party access. We commit to keeping this service non-commercial and focused on benefiting the community.
            </div>
          </div>
        </div>
			</div>
			<div className={styles.Element}>
        <div className={styles.Icon}>
          <ShieldIcon />
        </div>
				<div className={styles.Container}>
					<div className={styles.Title}>Access Requirements</div>
					<div className={styles.ContentContainer}>
						<div className={styles.Content}>
							To utilize our search engine, logging in with your Discord account is required after your fifth query. This measure helps prevent misuse and supports the sustainability of our service, which is provided completely free of charge. We chose Discord as our login method because it's familiar to the Healthy Gamer community, enhancing both access and security. The login
							requirement also helps us manage the costs associated with hosting the search engine, preventing abuse from users.
						</div>
					</div>
				</div>
			</div>
			<div className={styles.Element}>
        <div className={styles.Icon}>
          <GlassIcon />
        </div>
				<div className={styles.Container}>
					<div className={styles.Title}>Searching for Content</div>
					<div className={styles.ContentContainer}>
						<div className={styles.Content}>Simply type in how you feel, ask a question, or seek guidance on a specific topic related to mental health, gaming, or personal development. Our search engine uses advanced AI technology, employing embeddings and OpenAI's ADA-002 model to deeply understand the context and nuances of your queries.</div>
					</div>
				</div>
			</div>
			<div className={styles.Element}>
        <div className={styles.Icon}>
          <TVIcon />
        </div>
				<div className={styles.Container}>
					<div className={styles.Title}>Display of Search Results</div>
					<div className={styles.ContentContainer}>
						<div className={styles.Content}>
							Upon entering a query, the engine quickly processes your input and provides up to 15 relevant results. These results are meticulously chosen to fit within five or fewer different YouTube videos. Each result is presented as a direct link that includes a URL and a timestamp, allowing you to click and immediately start watching the video at the precise moment where
							Dr. K addresses the topic of your inquiry.
						</div>
					</div>
				</div>
			</div>
			<div className={styles.Element}>
        <div className={styles.Icon}>
          <RocketIcon />
        </div>
				<div className={styles.Container}>
					<div className={styles.Title}>Future Developments</div>
					<div className={styles.ContentContainer}>
						<div className={styles.Content}>While our search engine currently does not support bookmarking or saving functionalities, we are open to considering these features based on your feedback. Let us know how we can make your experience even better!</div>
					</div>
				</div>
			</div>
			<div className={styles.Actions}>
				<div className={styles.DonateButton}>
					<div className={styles.Donate}>Donate</div>
				</div>
				<div className={styles.LoginButton}>
					<div className={styles.Login}>Login</div>
				</div>
			</div>
		</div>
	);
};

export default HowItWorksSection;
