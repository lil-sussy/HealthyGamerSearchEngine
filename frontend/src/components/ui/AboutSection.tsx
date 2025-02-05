import React from "react";
import Logo from "../Logo";

const AboutSection = () => {
	return (
		<div className="w-full box-border p-10 pb-6 flex flex-col justify-start items-start gap-18">
			<div className="flex w-full flex-row justify-start gap-12">
				<div className="flex flex-col justify-center items-start w-3/5 gap-36">
					<div className="flex flex-col justify-center items-start relative font-poppins">
						<div className="w-60 h-12 absolute left-[-14px] top-24 bg-green-500 bg-opacity-40 rounded-lg z-[-10]" />
						<div className="w-full text-black text-4xl font-medium leading-tight">
							About The Search Engine
						</div>
					</div>
					<div className="flex flex-col justify-center items-start gap-12">
						<div className="text-black text-2xl font-bold font-segoe leading-7">
							Why We Built This
						</div>
						<div className="px-8 justify-center items-start gap-2 inline-flex">
							<div className="w-full text-black text-base font-normal font-segoe leading-5">
								As long-time viewers and supporters of Dr. K, we noticed that the wisdom spread across his videos could be hard to pinpoint when you need it most. This search engine was created to solve that problem, making it easier for everyone in the community to access valuable insights quickly and effectively.
							</div>
						</div>
					</div>
				</div>
				<div className="relative w-96 h-96">
					<img className="w-80 h-80 rounded-2xl" src="./dr k confident.png" alt="Placeholder" />
					<div className="absolute top-[-10%] left-[-20%] z-20">
						<Logo />
					</div>
				</div>
			</div>
			<div className="flex w-full flex-row justify-start gap-12">
				<img className="w-72 h-88 rounded-2xl" src="./drk-confident-image2.png" alt="Placeholder" />
				<div className="flex flex-col justify-center items-start gap-4">
					<div className="text-black text-2xl font-bold font-segoe leading-7">
						Using Discord to Log In
					</div>
					<div className="px-7 flex flex-col justify-start items-start gap-6">
						<div className="w-full text-black text-base font-normal font-segoe leading-5">
							<span>
								To use this search engine, you will need to log in using your Discord account. We chose Discord login for several reasons:
								<br />
							</span>
							<span className="font-bold">Community-Centric</span>
							<span>
								: Many of Healthy Gamer's viewers are already active on Discord, making it a familiar and accessible option.
								<br />
								Security: Discord provides a secure authentication system that helps protect your privacy and data.
								<br />
							</span>
							<span className="font-bold">Supporting the Platform</span>
							<span>: The costs associated with hosting our search engine and the AI technologies that power the searches are significant. By requiring a login, we can better manage these resources and ensure the sustainability of this free service to the community.</span>
						</div>
						<div className="flex justify-start items-start gap-6">
							<div className="flex px-10 py-3 bg-green-500 bg-opacity-40 justify-start items-start gap-2">
								<div className="text-black text-sm font-normal">
									Login
								</div>
							</div>
							<div className="flex px-10 py-3 bg-transparent border border-green-500 justify-start items-start gap-2">
								<div className="text-black text-sm font-normal">
									Share feedback
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-row justify-start gap-12">
				<div className="flex flex-col justify-center items-start gap-4">
					<div className="text-black text-2xl font-bold font-segoe leading-7">
						Who is Dr. K?
					</div>
					<div className="px-8 justify-center items-start gap-2 inline-flex">
						<div className="w-full text-black text-base font-normal font-segoe leading-5">
							<span>A Pioneer in Mental Health and Gaming. Dr. Alok Kanojia, better known as Dr. K, is a Harvard-trained psychiatrist and the visionary behind </span>
							<a href="https://www.healthygamer.gg/" className="text-green-500 underline" target="_blank" rel="noopener noreferrer">
								Healthy Gamer GG
							</a>
							<span>
								. He specializes in issues at the intersection of video gaming and mental health, particularly affecting the gaming community. Through his YouTube channel, Healthy Gamer GG, Dr. K offers interviews, Q&A sessions, and discussions aimed at improving mental health awareness and providing support for gamers and others.
								<br />
								Dr. K's approach combines traditional psychiatric knowledge with an in-depth understanding of the gaming culture, making his advice not only medically relevant but also culturally resonant with his audience.
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutSection;