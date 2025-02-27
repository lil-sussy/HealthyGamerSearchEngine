import { Card, Space, Typography, Statistic, Tag, Tooltip } from "antd";
import {
  LinkOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { formatTimestamp } from "@/heroSection/utils/timeUtils";
import { Occurrence } from "@/heroSection/types/Video";

function OccurenceDetails({ occurrence }: { occurrence: Occurrence }) {
  return (
    <Card className="w-full" title={`Selected occurrence : ${formatTimestamp(occurrence.timestamp)}`}>
      <Space direction="vertical" size="middle" className="w-full">
        <Space size="large">
          <Statistic
            title="Rank"
            value={occurrence.rank}
            prefix="#"
            valueStyle={{ fontSize: "1.25rem" }}
          />
          <Statistic
            title="Distance"
            value={Math.round(occurrence.distance * 100) / 100}
            valueStyle={{
              fontSize: "1.25rem",
              color:
                occurrence.distance < 0.81
                  ? "#3f8600"
                  : occurrence.distance < 0.92
                    ? "#faad14"
                    : "#cf1322",
            }}
          />
        </Space>

        <Typography.Paragraph ellipsis={{ rows: 2 }} className="text-sm">{`"${occurrence.quote}"`}</Typography.Paragraph>

        <Typography.Link
          href={occurrence.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "1rem" }}
        >
          <LinkOutlined /> {occurrence.url}
        </Typography.Link>

        <Space size="middle">
          <Tooltip title="Timestamp">
            <Tag icon={<ClockCircleOutlined />} color="blue">
              {formatTimestamp(occurrence.timestamp)}
            </Tag>
          </Tooltip>
          <Tooltip title="Duration">
            <Tag icon={<FieldTimeOutlined />} color="purple">
              ~{formatTimestamp(occurrence.duration)}
            </Tag>
          </Tooltip>
        </Space>
      </Space>
    </Card>
  );
}

export { OccurenceDetails };
