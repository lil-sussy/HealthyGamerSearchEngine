import React, { useEffect, useState } from "react";
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
	const [seekTime, setSeekTime] = useState(video.occurrences[0].timestamp);
  const [occurrence, setOccurrence] = useState<Occurrence>(video.occurrences[0]);
  const [distanceClass, setDistanceClass] = useState("");

	const handleSelectTime = (occurrence: Occurrence) => {
    setOccurrence(occurrence);
		setSeekTime(occurrence.timestamp);
    if (occurrence.distance < 0.81) {
			setDistanceClass(styles.DistanceGreen);
		} else if (occurrence.distance < 0.92) {
			setDistanceClass(styles.DistanceOrange);
		} else {
      setDistanceClass(styles.DistanceRed);
    }
	};

  function formatTime(seconds: number) {
		const date = new Date(0);
		date.setSeconds(seconds);
		const timeString = date.toISOString().substr(11, 8);
		// If the hours are '00', return only the minutes and seconds
		return timeString.startsWith("00:") ? timeString.substr(3) : timeString;
	}

  useEffect(() => {
    handleSelectTime(video.occurrences[0]);
  }, []);

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
					<h5 className={distanceClass}>Distance: {Math.round(occurrence.distance * 100) / 100}</h5>
				</div>
				<a href={occurrence.url} className={styles.URL}>
					{occurrence.url}
				</a>
				<div className={styles.VideoTime}>
					<h5>{formatTime(occurrence.timestamp)}</h5>
					<h5>~{formatTime(occurrence.duration)}</h5>
				</div>
				<p>"{occurrence.quote}"</p>
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
      playerRef.current.setState({ playerState: "unstarted" });
			playerRef.current.seekTo(seekTime, "seconds");
		}
    setInterval(() => {
      playerRef!.current!.setState({ playerState: "unstarted" });
    }, 500)
	}, [seekTime]);

	return (
		<ReactPlayer
			ref={playerRef}
			url={`https://www.youtube.com/watch?v=${videoId}`}
			controls
      width={"100%"}
      height={"100%"}
			playing={true} // Disabled autoplay
			onReady={() => playerRef.current!.seekTo(seekTime, "seconds")}
		/>
	);
}

export { VideoPlayer };

function TimeBar({ occurrences, totalDuration, onSelect }: { occurrences: any[]; totalDuration: number; onSelect: (occurrence: Occurrence) => void }) {
	return (
		<div className={styles.Timebar} style={{ position: "relative", width: "100%", }}>
			{occurrences.map((occurrence, index) => {
				const left = `${Math.max((occurrence.timestamp / totalDuration) * 100, 2)}%`;
				const width = `${Math.max((occurrence.duration / totalDuration) * 100, 2)}%`;

				return <div key={index} style={{ position: "absolute", left, width, height: "100%", cursor: "pointer" }} onClick={() => onSelect(occurrence)} title={occurrence.quote}></div>;
			})}
		</div>
	);
}

export { TimeBar };
