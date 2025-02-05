import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";
import type YouTubePlayer from "react-player/youtube";
import type { Video, Occurrence } from "../../types/Video";

function VideoResultDisplay({ video }: { video: Video }) {
	const [seekTime, setSeekTime] = useState(video.occurrences[0].timestamp);
	const [occurrence, setOccurrence] = useState<Occurrence>(video.occurrences[0]);
	const [distanceClass, setDistanceClass] = useState("");

	const handleSelectTime = (occurrence: Occurrence) => {
		setOccurrence(occurrence);
		setSeekTime(occurrence.timestamp);
		if (occurrence.distance < 0.81) {
			setDistanceClass("bg-green-200");
		} else if (occurrence.distance < 0.92) {
			setDistanceClass("bg-yellow-200");
		} else {
			setDistanceClass("bg-red-200");
		}
	};

	function formatTime(seconds: number) {
		const date = new Date(0);
		date.setSeconds(seconds);
		const timeString = date.toISOString().substr(11, 8);
		return timeString.startsWith("00:") ? timeString.substr(3) : timeString;
	}

	useEffect(() => {
		handleSelectTime(video.occurrences[0]);
	}, []);

	return (
		<div className="flex flex-wrap justify-center w-full md:w-3/4 lg:w-1/2 !px-8 !pl-20 !py-4 box-border relative">
			<h1 className="absolute -left-14 top-4 text-shadow-lg !text-[5rem] !font-black text-purple-200">{`#${video.occurrences[0].rank}`}</h1>
			<div className="w-full h-80 !border-8 !border-purple-200 rounded-lg">
				<VideoPlayer videoId={video.video_id} seekTime={seekTime} />
			</div>
			<div className="flex flex-col items-center w-full !mt-8 gap-2">
				<h4 className="text-xl text-purple-200">Results :</h4>
				<TimeBar occurrences={video.occurrences} totalDuration={video.duration} onSelect={handleSelectTime} />
			</div>
			<div className="flex flex-col items-start w-full !mt-8 !p-8 !border-2 !border-purple-200 !rounded-lg !gap-4">
				<div className="flex items-center gap-8">
					<h5 className="bg-gray-200 p-2 rounded">{`Rank: #${occurrence.rank}`}</h5>
					<h5 className={`p-2 rounded ${distanceClass}`}>{`Distance: ${Math.round(occurrence.distance * 100) / 100}`}</h5>
				</div>
				<a href={occurrence.url} className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">
					{occurrence.url}
				</a>
				<div className="flex items-center gap-4">
					<h5 className="text-sm">{formatTime(occurrence.timestamp)}</h5>
					<h5 className="text-sm">{`~${formatTime(occurrence.duration)}`}</h5>
				</div>
			</div>
		</div>
	);
}

export { VideoResultDisplay };

function VideoPlayer({ videoId, seekTime }: { videoId: string; seekTime: number }) {
	const playerRef = React.useRef<YouTubePlayer | null>(null);
	seekTime = Math.round(seekTime);

	React.useEffect(() => {
		if (playerRef.current) {
			playerRef.current.setState({ playerState: "unstarted" });
			playerRef.current.seekTo(seekTime, "seconds");
		}
		setInterval(() => {
			playerRef!.current!.setState({ playerState: "unstarted" });
		}, 2000);
	}, [seekTime]);

	return (
		<ReactPlayer
			ref={playerRef}
			url={`https://www.youtube.com/watch?v=${videoId}`}
			controls
			width={"100%"}
			height={"100%"}
			playing={false}
			onReady={() => playerRef.current!.seekTo(seekTime, "seconds")}
		/>
	);
}

export { VideoPlayer };

function TimeBar({ occurrences, totalDuration, onSelect }: { occurrences: Occurrence[]; totalDuration: number; onSelect: (occurrence: Occurrence) => void }) {
	return (
		<div className="relative w-full h-4 bg-gray-300 rounded">
			{occurrences.map((occurrence, index) => {
				const left = `${Math.max((occurrence.timestamp / totalDuration) * 100, 2)}%`;
				const width = `${Math.max((occurrence.duration / totalDuration) * 100, 2)}%`;

				return (
					<div
						key={index}
						style={{ position: "absolute", left, width, height: "100%" }}
						className="bg-purple-200 rounded cursor-pointer"
						onClick={() => onSelect(occurrence)}
						title={occurrence.quote}
					></div>
				);
			})}
		</div>
	);
}

export { TimeBar };
