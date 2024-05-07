import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import type YouTubePlayer from "react-player/youtube";

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

	const handleSelectTime = (time: number) => {
		setSeekTime(time);
	};


	return (
		<div className="video-section">
			<VideoPlayer videoId={video.video_id} seekTime={seekTime} />
			<TimeBar occurrences={video.occurrences} totalDuration={video.duration} onSelect={handleSelectTime} />
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

function TimeBar({ occurrences, totalDuration, onSelect }: { occurrences: any[]; totalDuration: number; onSelect: (timestamp: number) => void }) {
	return (
		<div className="time-bar" style={{ position: "relative", height: "50px", width: "100%", backgroundColor: "#ddd" }}>
			{occurrences.map((occurrence, index) => {
				const left = `${Math.max((occurrence.timestamp / totalDuration) * 100, 2)}%`;
				const width = `${Math.max((occurrence.duration / totalDuration) * 100, 2)}%`;

				return <div key={index} style={{ position: "absolute", left, width, height: "100%", backgroundColor: "rgba(0, 123, 255, 0.5)", cursor: "pointer" }} onClick={() => onSelect(occurrence.timestamp)} title={occurrence.quote}></div>;
			})}
		</div>
	);
}

export { TimeBar };
