import { Typography } from "antd";

const { Title } = Typography;

const MainTitle = () => (
  <Typography>
    <Title level={2} className="m-0 text-text">
      <span className="font-medium">Unofficial Healthy Gamer GG </span>
      <span className="font-bold text-primary">Video Search Engine</span>
    </Title>
  </Typography>
);

export default MainTitle;
