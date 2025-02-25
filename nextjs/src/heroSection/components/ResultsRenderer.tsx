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
    <ResultsList results={results} />
    <RatingSection rateValue={rateValue} handleRateChange={handleRateChange} />
  </div>
);

const RatingSection = ({ rateValue, handleRateChange }: { rateValue: number | null; handleRateChange: (value: number) => void }) => (
  <div className="rating-section flex flex-col items-start justify-between gap-2 rounded-lg bg-gray-200 !p-4">
    <Text className="w-[20rem] text-base font-light text-gray-600">
      Rate those results to improve the search engine!
    </Text>
    <Rate
      value={rateValue ?? 0}
      onChange={handleRateChange}
      className="w-[20rem]"
    />
  </div>
);

const ResultsList = ({ results }: { results: Video[] }) => (
  <div className="results-list flex flex-col gap-2">
    {results.map((video, index) => (
      <VideoResultDisplay key={index} video={video} />
    ))}
  </div>
); 