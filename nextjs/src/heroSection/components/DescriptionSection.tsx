import { Card, Space, Button, Typography } from "antd";

const { Paragraph } = Typography;

const DescriptionSection = () => (
  <Card className="mt-4 bg-layer1/50 backdrop-blur-2xl">
    <Space direction="vertical" size="middle">
      <Paragraph className="text-lg text-text">
        Welcome to the Unofficial Healthy Gamer GG Search Engine, a dedicated
        tool designed by fans for fans. This platform allows you to navigate
        through the extensive content of Dr. K&apos;s videos to find specific
        advice, insights, and discussions tailored to your mental health and
        wellness needs.
      </Paragraph>

      <Space>
        <Button type="primary" className="bg-primary hover:bg-primary/90">
          Support
        </Button>
        <Button
          type="default"
          className="border-primary text-primary hover:border-primary/80 hover:text-primary/80"
        >
          Share feedback
        </Button>
      </Space>
    </Space>
  </Card>
);

export default DescriptionSection;
