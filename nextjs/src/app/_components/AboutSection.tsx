import React from "react";
import { Button, Typography, Space, Divider, Row, Col } from "antd";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import Link from "next/link";
import clsx from "clsx";

// Define a common paragraph text size
const paragraphClass = "text-base md:text-lg font-segoe sm:text-lg";

const AboutSection = () => {
	return (
		<section className="w-full p-6 md:p-10">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-16">
				{/* About The Search Engine Section */}
				<div className="md:col-span-7 space-y-8">
					<div className="relative">
						<div className="absolute left-32 top-4 w-60 h-6 bg-primary/30 bg-opacity-40 rounded-lg -z-10" />
						<Title level={2} className="font-poppins font-medium">
							About The Search Engine
						</Title>
					</div>
					
					<Space direction="vertical" size="large">
						<Typography>
							<Title level={3} className="font-segoe font-bold mb-4">
								Why I Built This
							</Title>
							<Paragraph className={clsx(paragraphClass)}>
								As long-time viewers and supporters of Dr. K, we noticed that the wisdom spread across his videos could be hard to pinpoint when you need it most. This search engine was created to solve that problem, making it easier for everyone in the community to access valuable insights quickly and effectively.
							</Paragraph>
						</Typography>
					</Space>
				</div>
				
				<div className="md:col-span-5 flex justify-center md:justify-start">
					<div 
						className="rounded-2xl w-72 h-72 md:w-80 md:h-80 bg-fit bg-center bg-no-repeat border-8 border-primary" 
						style={{ backgroundImage: "url('/images/dr k confident.png')" }}
						role="img"
						aria-label="Dr. K"
					/>
				</div>
			</div>

			{/* Discord Login Section */}
			<div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
				<div className="md:col-span-5 flex justify-center md:justify-end">
					<div 
						className="rounded-2xl w-72 h-80 bg-fit bg-center bg-no-repeat border-8 border-primary" 
						style={{ backgroundImage: "url('/images/drk-confident-image2.png')" }}
						role="img"
						aria-label="Dr. K"
					/>
				</div>
				
				<div className="md:col-span-7 space-y-6">
					<Title level={3} className="font-segoe font-bold">
						Using Discord to Login
					</Title>
					
					<Space direction="vertical" size="large">
						<Paragraph className={clsx(paragraphClass)}>
							To use this search engine, you will need to log in using your Discord account. We chose Discord login for several reasons:
							<br /><br />
							<Text strong>Community-Centric</Text>: Many of Healthy Gamer&apos;s viewers are already active on Discord, making it a familiar and accessible option.
							<br />
							Security: Discord provides a secure authentication system that helps protect your privacy and data.
							<br /><br />
							<Text strong>Supporting the Platform</Text>: The costs associated with hosting our search engine and the AI technologies that power the searches are significant. By requiring a login, we can better manage these resources and ensure the sustainability of this free service to the community.
						</Paragraph>
						
						<Space size="middle">
							<Button 
								type="primary" 
								size="large"
								className=" bg-opacity-40 border-none"
							>
								Login
							</Button>
							<Button 
								size="large"
								className=" text-black"
							>
								Share feedback
							</Button>
						</Space>
					</Space>
				</div>
			</div>

			{/* Who is Dr. K Section */}
			<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
				<div className="md:col-span-10 space-y-4">
					<Title level={3} className="font-segoe font-bold">
						Who is Dr. K?
					</Title>
					<Paragraph className={clsx(paragraphClass)}>
						A Pioneer in Mental Health and Gaming. Dr. Alok Kanojia, better known as Dr. K, is a Harvard-trained psychiatrist and the visionary behind{" "}
						<Link href="https://www.healthygamer.gg/" target="_blank" className="text-green-500">
							Healthy Gamer GG
						</Link>
						. He specializes in issues at the intersection of video gaming and mental health, particularly affecting the gaming community. Through his YouTube channel, Healthy Gamer GG, Dr. K offers interviews, Q&A sessions, and discussions aimed at improving mental health awareness and providing support for gamers and others.
						<br /><br />
						Dr. K&apos;s approach combines traditional psychiatric knowledge with an in-depth understanding of the gaming culture, making his advice not only medically relevant but also culturally resonant with his audience.
					</Paragraph>
				</div>
			</div>
		</section>
	);
};

export default AboutSection;