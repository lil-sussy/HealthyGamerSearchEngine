import ReactPlayer from "react-player/youtube";
import type YouTubePlayer from "react-player/youtube";
import React from "react";

function VideoPlayer({
  videoId,
  seekTime,
}: {
  videoId: string;
  seekTime: number;
}) {
  const playerRef = React.useRef<YouTubePlayer>(null);
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
