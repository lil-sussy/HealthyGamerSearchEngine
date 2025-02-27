import React from "react";
import { AiCloudIcon, ShieldIcon, GlassIcon, TVIcon, RocketIcon } from "@/app/_icons/icons";
import { Typography, Row, Col, Card, Space, Button, Divider } from "antd";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

const HowItWorksSection = () => {
	return (
		<div className="mt-20 w-full box-border p-24">
			<Row className="mb-14 relative">
				<div className="w-40 h-8 z-[-10] absolute left-72 top-4 bg-primary bg-opacity-20 rounded-lg" />
				<Title level={2} className="font-poppins">
					How It Works
				</Title>
			</Row>

			<Space direction="vertical" size="large" className="w-full">
				{/* Data Privacy and Usage */}
				<Row gutter={[32, 0]} align="middle">
					<Col span={5} className="flex justify-center">
						<AiCloudIcon />
					</Col>
					<Col span={19}>
						<Card bordered={false} className="bg-background/30">
							<Title level={4} className="font-bold font-segoe">
								Data Privacy and Usage
							</Title>
							<Paragraph className="font-segoe">
								Your privacy is paramount to us. The data collected is entirely anonymous and used exclusively to enhance the functionality and performance of the search engine. This information is not linked to your Discord account and is securely protected against third-party access. We commit to keeping this service non-commercial and focused on benefiting the community.
							</Paragraph>
						</Card>
					</Col>
				</Row>

				{/* Access Requirements */}
				<Row gutter={[32, 0]} align="middle">
					<Col span={5} className="flex justify-center">
						<ShieldIcon />
					</Col>
					<Col span={19}>
						<Card bordered={false} className="bg-background/30">
							<Title level={4} className="font-bold font-segoe">
								Access Requirements
							</Title>
							<Paragraph className="font-segoe">
								To utilize our search engine, logging in with your Discord account is required after your fifth query. This measure helps prevent misuse and supports the sustainability of our service, which is provided completely free of charge. We chose Discord as our login method because it&apos;s familiar to the Healthy Gamer community, enhancing both access and security. The login requirement also helps us manage the costs associated with hosting the search engine, preventing abuse from users.
							</Paragraph>
						</Card>
					</Col>
				</Row>

				{/* Searching for Content */}
				<Row gutter={[32, 0]} align="middle">
					<Col span={5} className="flex justify-center">
						<GlassIcon />
					</Col>
					<Col span={19}>
						<Card bordered={false} className="bg-background/30">
							<Title level={4} className="font-bold font-segoe">
								Searching for Content
							</Title>
							<Paragraph className="font-segoe">
								Simply type in how you feel, ask a question, or seek guidance on a specific topic related to mental health, gaming, or personal development. Our search engine uses advanced AI technology, employing embeddings and OpenAI&apos;s ADA-002 model to deeply understand the context and nuances of your queries.
							</Paragraph>
						</Card>
					</Col>
				</Row>

				{/* Display of Search Results */}
				<Row gutter={[32, 0]} align="middle">
					<Col span={5} className="flex justify-center">
						<TVIcon />
					</Col>
					<Col span={19}>
						<Card bordered={false} className="bg-background/30">
							<Title level={4} className="font-bold font-segoe">
								Display of Search Results
							</Title>
							<Paragraph className="font-segoe">
								Upon entering a query, the engine quickly processes your input and provides up to 15 relevant results. These results are meticulously chosen to fit within five or fewer different YouTube videos. Each result is presented as a direct link that includes a URL and a timestamp, allowing you to click and immediately start watching the video at the precise moment where Dr. K addresses the topic of your inquiry.
							</Paragraph>
						</Card>
					</Col>
				</Row>

				{/* Future Developments */}
				<Row gutter={[32, 0]} align="middle">
					<Col span={5} className="flex justify-center">
						<RocketIcon />
					</Col>
					<Col span={19}>
						<Card bordered={false} className="bg-background/30">
							<Title level={4} className="font-bold font-segoe">
								Future Developments
							</Title>
							<Paragraph className="font-segoe">
								While our search engine currently does not support bookmarking or saving functionalities, we are open to considering these features based on your feedback. Let us know how we can make your experience even better!
							</Paragraph>
						</Card>
					</Col>
				</Row>
			</Space>

			<Row justify="start" className="mt-14">
				<Space size="middle">
					<Button 
						type="primary" 
						size="large" 
						className=" bg-opacity-40 border-none text-black hover:bg-opacity-60"
					>
						Donate
					</Button>
					<Button 
						type="default" 
						size="large" 
						className="border-primary text-black hover:border-primary"
					>
						Login
					</Button>
				</Space>
			</Row>
		</div>
	);
};

export default HowItWorksSection;
