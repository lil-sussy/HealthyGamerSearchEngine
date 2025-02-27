import { Occurrence } from "@/heroSection/types/Video";
import { Timeline, Typography } from "antd";
import { formatTimestamp } from "@/heroSection/utils/timeUtils";

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
      {occurrences.slice(0, 5).map((occurrence) => (
        <Timeline.Item
          key={occurrence.timestamp}
          dot={
            <div className="timeline-dot h-2.5 w-2.5 overflow-hidden rounded-full border-2 border-primary bg-transparent" />
          }
          color="gray"
          className="timeline-item cursor-pointer overflow-hidden"
          style={{ width: `25%` }}
        >
          <div
            className="timeline-content pr-2"
            onClick={() => onSelect(occurrence)}
          >
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
