import Logo from "./Logo";
import { SearchIconSmall, SearchIconBig } from "./SearchIcon";
import styles from "./HeroHeader.module.scss";
import React, { useEffect, useState } from "react";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, getIdToken , onAuthStateChanged } from "firebase/auth";
import type { Video, Occurrence } from "./Videos";
import { VideoResultDisplay } from "./Videos";
import { Oval } from "react-loader-spinner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import app from "../firebase";
const auth = getAuth(app);

const HeroHeader = ({ idToken }: { idToken: string }) => {
	const [query, setQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const test =
		'[{"video_id": "bavdneN9sKg", "duration": 3006, "occurrences": [{"quote": "So the reason that procrastination is so resistant..", "url": "https://www.youtube.com/watch?v=bavdneN9sKg?&=66s", "rank": 1, "distance": 0.726568341255188, "timestamp": 76.006, "duration": 2.700000000000003}, {"quote": "So the process of changing and overcoming procrastination..", "url": "https://www.youtube.com/watch?v=bavdneN9sKg?&=299s", "rank": 2, "distance": 0.737909734249115, "timestamp": 309.566, "duration": 3.420000000000016}, {"quote": "So how do you deal with \\"Idealistic Procrastination\\"?", "url": "https://www.youtube.com/watch?v=bavdneN9sKg?&=821s", "rank": 5, "distance": 0.7969357371330261, "timestamp": 831.606, "duration": 2.3999999999999773}, {"quote": "..dealing with \\"Avoidance Procrastination\\".. ..", "url": "https://www.youtube.com/watch?v=bavdneN9sKg?&=2544s", "rank": 8, "distance": 0.8097485303878784, "timestamp": 2554.906, "duration": 2.8400000000001455}, {"quote": "This is how you deal with procrastination.", "url": "https://www.youtube.com/watch?v=bavdneN9sKg?&=2434s", "rank": 9, "distance": 0.8102132081985474, "timestamp": 2444.466, "duration": 1.599999999999909}]}, {"video_id": "tcXCnYs6s_U", "duration": 846, "occurrences": [{"quote": "so if you want to disable the procrastination you need to do one one of two things either let go of the perfectionism entirely and be okay starting without being perfect which there\'s a path to we\'ve done a video about you know we\'ve done multiple videos about how to overcome procrastination there\'s something in the ADHD guide and guide doing stuff by the way but let\'s understand that procrastination if your goal is perfection you can\'t get started until you have a plan that is perfect so since there\'s no such thing as a perfect plan because as a human being you can\'t predict the future it\'s impossible to get started so why do we say that this procrastinates does this person never do anything no they do stuff", "url": "https://www.youtube.com/watch?v=tcXCnYs6s_U?&=131s", "rank": 3, "distance": 0.7759290933609009, "timestamp": 141.9, "duration": 37.859999999999985}, {"quote": "and it\'s all because of my crippling perfectionism every task feels like a defeat and if anything isn\'t perfect it\'s like I\'m failing at everything I put every task on the back burner procrastinating on everything I need to do because I\'m too afraid of not being able to execute it perfectly I feel like I\'m stuck in a cycle of perfectionism and procrastination I don\'t know how to break free I don\'t know where to begin and what\'s worse I don\'t know what to do if it doesn\'t work out have any of you experienced this level of perfectionism before how did you overcome it are there any strategies or techniques that have worked for you I\'m willing to try anything at this point the first thing that I\'m going to say is someone says I\'m willing to try anything and this is why I\'m going to start by pushing back a little bit", "url": "https://www.youtube.com/watch?v=tcXCnYs6s_U?&=34s", "rank": 4, "distance": 0.7852009534835815, "timestamp": 44.219, "duration": 42.061}, {"quote": "so let\'s understand a couple things the first is that the procrastination is a symptom of the root of perfectionism", "url": "https://www.youtube.com/watch?v=tcXCnYs6s_U?&=96s", "rank": 6, "distance": 0.8078023791313171, "timestamp": 106.619, "duration": 8.941000000000003}, {"quote": "but you\'re not sitting in that middle Zone if that makes sense you\'ve pushed through the procrastination or you\'ve run away from the procrastination and now the problem has become you\'ve never you haven\'t really conquered the procrastination you\'ve let your guilt despair or frustration or overcome it which means now you are becoming dependent on the frustration fear or guilt to overcome the procrastination then you\'re screwed because you\'re damned if you do damned if you don\'t so what we need to do is just sit with procrastination just sit there in that moment it\'s not about beating yourself up today I need to do some studying I\'m going to try to study right now don\'t force yourself into it notice the frustration just sit there and don\'t do your work sit with the procrastination don\'t start it don\'t don\'t run away from it don\'t beat yourself up you\'ll notice those things and move away from when you start beating yourself up now I should just start it", "url": "https://www.youtube.com/watch?v=tcXCnYs6s_U?&=511s", "rank": 10, "distance": 0.8122245669364929, "timestamp": 521.94, "duration": 56.41999999999996}]}, {"video_id": "rRthWUrrpu0", "duration": 5938, "occurrences": [{"quote": "so procrastination fear of conflict avoidance", "url": "https://www.youtube.com/watch?v=rRthWUrrpu0?&=174s", "rank": 7, "distance": 0.8087915182113647, "timestamp": 184.45, "duration": 11.039000000000016}]}]';
  // const [results, setResults] = useState<Video[]>(JSON.parse(test));
  const [results, setResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

	const handleInputChange = (event: any) => {
		setQuery(event.target.value);
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		if (!query.trim()) return;

    setLoading(true);

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
        setResults(data);
      } else {
        setResponseMessage(`Error: ${data.message || JSON.stringify(data)}`);
      }
		} catch (error) {
      //@ts-ignore
			setResponseMessage(`Error: ${error.message}`);
		}
	};
	return (
		<div className={styles.HeroHeaderContainer}>
			<div className={styles.HeroHeader}>
				{/* <div className="PurpleBlur" />
				<div className="GreenBlur" /> */}
				<div className={styles.DrKImageContainer}>
					<img className={styles.Image7} src="./drkStaring.png" alt="Placeholder" />
					<div className={styles.Logo}>
						<Logo />
					</div>
				</div>
				<div className={styles.RightContent}>
					<div className={styles.Title}>
						<span className={styles.textBlack}>Unofficial Healthy Gamer GG </span>
						<span className={styles.textGreen}>Search Engine</span>
					</div>
					<div className={styles.Content}>
						<form className={styles.SearchBarContainer} onSubmit={handleSubmit}>
							<div className={styles.SearchBar}>
								<SearchIconSmall />
								<input type="text" className={styles.input} placeholder="What’s on your mind..." value={query} onChange={handleInputChange} disabled={loading} />
							</div>
							<button className={styles.SearchButton} type="submit">
								{loading ? <Spinner /> : <SearchIconBig />}
							</button>
						</form>
						{loading ? (
							<div className={styles.PlaceholderRectContainer}>
								{[...Array(3)].map((_, index) => (
									<RectanglePlaceholder key={index} width={500} height={250} />
								))}
							</div>
						) : (
							<>
								{responseMessage && <div className="response-message">{responseMessage}</div>}
								{!responseMessage && results.length > 0 && (
									<div className="results">
										{results.map((video: Video, index: number) => (
											<VideoResultDisplay key={index} video={video} />
										))}
									</div>
								)}
							</>
						)}
						<div className={styles.IndentContainer}>
							<div className={styles.WelcomeText}>Welcome to the Unofficial Healthy Gamer GG Search Engine, a dedicated tool designed by fans for fans. This platform allows you to navigate through the extensive content of Dr. K's videos to find specific advice, insights, and discussions tailored to your mental health and wellness needs.</div>
							<div className={styles.Actions}>
								<div className={styles.Donate}>Donate</div>
								<div className={styles.ShareFeedback}>Share feedback</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const RectanglePlaceholder = ({ height, width }: { height: number; width: number }) => (
	<SkeletonTheme baseColor="#E1E1E1" highlightColor="#F3F3F3">
		<Skeleton height={height} width={width} /> {/* Example for an input */}
	</SkeletonTheme>
);

function Spinner() {
  return (
    <Oval
      height={80}
      width={80}
      color="#4fa94d"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor="#4fa94d"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );
}

export default HeroHeader;
