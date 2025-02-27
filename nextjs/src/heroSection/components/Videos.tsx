import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";
import type YouTubePlayer from "react-player/youtube";
import type { Video, Occurrence } from "@/heroSection/types/Video";
import { Timeline, Typography } from "antd";
import { formatTimestamp } from "@/heroSection/utils/timeUtils";

function VideoResultDisplay({ video }: { video: Video }) {
  const [seekTime, setSeekTime] = useState(
    video.occurrences[0]?.timestamp ?? 0,
  );
  const [occurrence, setOccurrence] = useState<Occurrence>(
    video.occurrences[0] ?? {
      quote: "",
      url: "",
      rank: 0,
      distance: 0,
      timestamp: 0,
      duration: 0,
    },
  );
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

  useEffect(() => {
    handleSelectTime(
      video.occurrences[0] ?? {
        quote: "",
        url: "",
        rank: 0,
        distance: 0,
        timestamp: 0,
        duration: 0,
      },
    );
  }, [video.occurrences]);

  return (
    <div className="video result container relative box-border flex w-full flex-wrap justify-center !px-8 !py-4 !pl-20">
      <h1 className="text-shadow-lg absolute -left-14 top-4 !text-[5rem] !font-black text-background">{`#${video.occurrences[0]?.rank ?? 0}`}</h1>
      <div className="h-80 w-full rounded-lg !border-8 border-background">
        <VideoPlayer videoId={video.video_id} seekTime={seekTime} />
      </div>
      <div className="!mt-8 flex w-full flex-col items-center gap-2">
        <h4 className="text-xl text-purple-200">Results :</h4>
        <TimeBar
          occurrences={video.occurrences}
          totalDuration={video.duration}
          onSelect={handleSelectTime}
        />
      </div>
      <div className="!mt-8 flex w-full flex-col items-start !gap-4 !rounded-lg !border-2 !border-purple-200 !p-8">
        <div className="flex items-center gap-8">
          <h5 className="rounded bg-gray-200 p-2">{`Rank: #${occurrence.rank}`}</h5>
          <h5
            className={`rounded p-2 ${distanceClass}`}
          >{`Distance: ${Math.round(occurrence.distance * 100) / 100}`}</h5>
        </div>
        <a
          href={occurrence.url}
          className="text-purple-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {occurrence.url}
        </a>
        <div className="flex items-center gap-4">
          <h5 className="text-sm">{formatTimestamp(occurrence.timestamp)}</h5>
          <h5 className="text-sm">{`~${formatTimestamp(occurrence.duration)}`}</h5>
        </div>
      </div>
    </div>
  );
}

export { VideoResultDisplay };

function VideoPlayer({
  videoId,
  seekTime,
}: {
  videoId: string;
  seekTime: number;
}) {
  const playerRef = React.useRef<YouTubePlayer | null>(null);
  seekTime = Math.round(seekTime);

  React.useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setState({ playerState: "unstarted" });
      playerRef.current.seekTo(seekTime, "seconds");
    }
    setInterval(() => {
      playerRef.current!.setState({ playerState: "unstarted" });
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

function TimeBar({
  occurrences,
  totalDuration,
  onSelect,
}: {
  occurrences: Occurrence[];
  totalDuration: number;
  onSelect: (occurrence: Occurrence) => void;
}) {
  return (
    <Timeline className="contract-timeline-container flex w-full items-start justify-start">
      {occurrences.map((occurrence) => (
        <Timeline.Item
          key={occurrence.timestamp}
          dot={
            <div className="timeline-dot h-2.5 w-2.5 overflow-hidden rounded-full border-2 border-primary bg-transparent" />
          }
          color="gray"
          className="timeline-item cursor-pointer overflow-hidden"
          style={{ width: `25%` }}
        >
          <div className="timeline-content pr-2">
            <Typography.Title
              level={5}
            >{`"${formatTimestamp(occurrence.timestamp)}"`}</Typography.Title>
            <Typography.Paragraph
              ellipsis={{ rows: 2 }}
              className="text-sm"
            >{`"${occurrence.quote}"`}</Typography.Paragraph>
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}

export { TimeBar };
