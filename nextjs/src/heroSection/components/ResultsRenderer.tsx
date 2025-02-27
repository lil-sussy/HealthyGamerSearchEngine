import { Rate, Typography } from "antd";
import { VideoResultDisplay } from "@/heroSection/components/Videos";
import type { Video } from "@/heroSection/types/Video";

const { Text } = Typography;

interface ResultsRendererProps {
  results: Video[];
  rateValue: number | null;
  handleRateChange: (value: number) => void;
}

export const ResultsRenderer = ({
  results,
  rateValue,
  handleRateChange,
}: ResultsRendererProps) => (
  <div className="results-container !mt-16 flex flex-col gap-4">
    <RatingSection rateValue={rateValue} handleRateChange={handleRateChange} />
    <div className="results-list flex flex-col gap-6 md:gap-4">
      {results.map((video, index) => (
        <VideoResultDisplay key={index} video={video} />
      ))}
    </div>
    <RatingSection rateValue={rateValue} handleRateChange={handleRateChange} />
  </div>
);

const RatingSection = ({
  rateValue,
  handleRateChange,
}: {
  rateValue: number | null;
  handleRateChange: (value: number) => void;
}) => (
  <div className="rating-section flex flex-col items-start justify-between gap-2 rounded-lg border border-background bg-background/60 p-4">
    <Text className="text-base font-light text-gray-600">
      Rate those results to improve the search engine!
    </Text>
    <Rate
      value={rateValue ?? 0}
      onChange={handleRateChange}
      className="w-[20rem]"
    />
  </div>
);
