import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import type YouTubePlayer from "react-player/youtube";

import styles from "./Videos.module.scss";

export type Occurrence = {
    quote: string;
    url: string;
    rank: number;
    distance: number;
    timestamp: number;
    duration: number;
};


export type Video = {
	video_id: string;
  duration: number;
	occurrences: Occurrence[];
};


function VideoResultDisplay({ video }: { video: Video }) {
  const firstOccurrenceTime = video.occurrences[0]?.timestamp; // Getting the first occurrence timestamp
	const [seekTime, setSeekTime] = useState(firstOccurrenceTime || 0);
  const [occurrence, setOccurrence] = useState<Occurrence>(video.occurrences[0]);

	const handleSelectTime = (time: number, occurrence: Occurrence) => {
    setOccurrence(occurrence);
		setSeekTime(time);
	};


	return (
		<div className={styles.VideoSection}>
			<h1>#{video.occurrences[0].rank}</h1>
			<div className={styles.VideoContainer}>
				<VideoPlayer videoId={video.video_id} seekTime={seekTime} />
			</div>
			<div className={styles.TimebarContainer}>
				<h4>Results :</h4>
				<TimeBar occurrences={video.occurrences} totalDuration={video.duration} onSelect={handleSelectTime} />
			</div>
      <div className={styles.OccurrenceDetails}>
        <div>
          <h5>Rank: #{occurrence.rank}</h5>
          <h5>Distance: {occurrence.distance}</h5>
        </div>
        <div>
          <h5>Timestamp: {occurrence.timestamp}</h5>
          <h5>Duration: {occurrence.duration}</h5>
        </div>
        <h5>{occurrence.url}</h5>
        <p>{occurrence.quote}</p>
      </div>
		</div>
	);
}

export { VideoResultDisplay };

function VideoPlayer({ videoId, seekTime }: { videoId: string; seekTime: number }) {
	const playerRef = React.useRef<YouTubePlayer | null>(null);;
  seekTime = Math.round(seekTime)

	React.useEffect(() => {
		if (playerRef.current) {
			playerRef.current.seekTo(seekTime, "seconds");
		}
	}, [seekTime]);

	return (
		<ReactPlayer
			ref={playerRef}
			url={`https://www.youtube.com/watch?v=${videoId}`}
			controls
			playing={false} // Disabled autoplay
			onReady={() => playerRef.current!.seekTo(seekTime, "seconds")}
		/>
	);
}

export { VideoPlayer };

function TimeBar({ occurrences, totalDuration, onSelect }: { occurrences: any[]; totalDuration: number; onSelect: (timestamp: number, occurrence: Occurrence) => void }) {
	return (
		<div className={styles.Timebar} style={{ position: "relative", height: "50px", width: "100%", }}>
			{occurrences.map((occurrence, index) => {
				const left = `${Math.max((occurrence.timestamp / totalDuration) * 100, 2)}%`;
				const width = `${Math.max((occurrence.duration / totalDuration) * 100, 2)}%`;

				return <div key={index} style={{ position: "absolute", left, width, height: "100%", cursor: "pointer" }} onClick={() => onSelect(occurrence.timestamp, occurrence)} title={occurrence.quote}></div>;
			})}
		</div>
	);
}

export { TimeBar };
