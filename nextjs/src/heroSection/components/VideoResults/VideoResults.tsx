import React, { useEffect, useState } from "react";
import type { Video, Occurrence } from "@/heroSection/types/Video";
import { VideoPlayer } from "./VideoPlayer";
import { TimeBar } from "./VideoTimebar";
import { OccurenceDetails } from "./OccurenceDetails";

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
    <div className="video result container relative box-border flex w-full flex-wrap justify-center px-8 py-4 md:pl-20 md:pt-4 pt-24 rounded-xl bg-background/40 border border-background">
      <h1 className="text-shadow-lg absolute md:-left-14 md:top-4 top-0 left-12 !text-[5rem] !font-black text-primary">{`#${video.occurrences[0]?.rank ?? 0}`}</h1>
      <div className="h-80 w-full rounded-lg !border-8 border-primary">
        <VideoPlayer videoId={video.video_id} seekTime={seekTime} />
      </div>
      <div className="mt-8 flex w-full flex-col items-center gap-2">
        <TimeBar
          occurrences={video.occurrences.slice(0, 4)}
          totalDuration={video.duration}
          onSelect={handleSelectTime}
        />
        {video.occurrences.length > 4 && (
          <TimeBar
            occurrences={video.occurrences.slice(4)}
            totalDuration={video.duration}
            onSelect={handleSelectTime}
          />
        )}
      </div>
      <OccurenceDetails occurrence={occurrence} />
    </div>
  );
}

export { VideoResultDisplay };

