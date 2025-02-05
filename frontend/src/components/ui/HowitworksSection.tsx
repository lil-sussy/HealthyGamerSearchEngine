import React from "react";
import { AiCloudIcon, ShieldIcon, GlassIcon, TVIcon, RocketIcon } from "./Logo";

const HowItWorksSection = () => {
	return (
		<div className="mt-20 w-full box-border p-24 flex flex-col justify-start items-start gap-14">
			<div className="flex flex-col justify-center items-end w-full relative">
				<div className="w-56 h-12 z-[-10] absolute left-96 top-8 bg-green-500 bg-opacity-40 rounded-lg" />
				<div className="w-full text-center text-black text-4xl font-medium font-poppins leading-tight">
					How It Works
				</div>
			</div>
			<div className="flex justify-start items-center gap-14">
				<div className="w-1/5">
					<AiCloudIcon />
				</div>
				<div className="flex flex-col justify-center items-start gap-4 w-4/5">
					<div className="text-black text-2xl font-bold font-segoe leading-7">
						Data Privacy and Usage
					</div>
					<div className="flex px-8 justify-center items-start gap-2 w-full box-border">
						<div className="text-black text-base font-normal font-segoe leading-5">
							Your privacy is paramount to us. The data collected is entirely anonymous and used exclusively to enhance the functionality and performance of the search engine. This information is not linked to your Discord account and is securely protected against third-party access. We commit to keeping this service non-commercial and focused on benefiting the community.
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-start items-center gap-14">
				<div className="w-1/5">
					<ShieldIcon />
				</div>
				<div className="flex flex-col justify-center items-start gap-4 w-4/5">
					<div className="text-black text-2xl font-bold font-segoe leading-7">
						Access Requirements
					</div>
					<div className="flex px-8 justify-center items-start gap-2 w-full box-border">
						<div className="text-black text-base font-normal font-segoe leading-5">
							To utilize our search engine, logging in with your Discord account is required after your fifth query. This measure helps prevent misuse and supports the sustainability of our service, which is provided completely free of charge. We chose Discord as our login method because it's familiar to the Healthy Gamer community, enhancing both access and security. The login requirement also helps us manage the costs associated with hosting the search engine, preventing abuse from users.
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-start items-center gap-14">
				<div className="w-1/5">
					<GlassIcon />
				</div>
				<div className="flex flex-col justify-center items-start gap-4 w-4/5">
					<div className="text-black text-2xl font-bold font-segoe leading-7">
						Searching for Content
					</div>
					<div className="flex px-8 justify-center items-start gap-2 w-full box-border">
						<div className="text-black text-base font-normal font-segoe leading-5">
							Simply type in how you feel, ask a question, or seek guidance on a specific topic related to mental health, gaming, or personal development. Our search engine uses advanced AI technology, employing embeddings and OpenAI's ADA-002 model to deeply understand the context and nuances of your queries.
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-start items-center gap-14">
				<div className="w-1/5">
					<TVIcon />
				</div>
				<div className="flex flex-col justify-center items-start gap-4 w-4/5">
					<div className="text-black text-2xl font-bold font-segoe leading-7">
						Display of Search Results
					</div>
					<div className="flex px-8 justify-center items-start gap-2 w-full box-border">
						<div className="text-black text-base font-normal font-segoe leading-5">
							Upon entering a query, the engine quickly processes your input and provides up to 15 relevant results. These results are meticulously chosen to fit within five or fewer different YouTube videos. Each result is presented as a direct link that includes a URL and a timestamp, allowing you to click and immediately start watching the video at the precise moment where Dr. K addresses the topic of your inquiry.
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-start items-center gap-14">
				<div className="w-1/5">
					<RocketIcon />
				</div>
				<div className="flex flex-col justify-center items-start gap-4 w-4/5">
					<div className="text-black text-2xl font-bold font-segoe leading-7">
						Future Developments
					</div>
					<div className="flex px-8 justify-center items-start gap-2 w-full box-border">
						<div className="text-black text-base font-normal font-segoe leading-5">
							While our search engine currently does not support bookmarking or saving functionalities, we are open to considering these features based on your feedback. Let us know how we can make your experience even better!
						</div>
					</div>
				</div>
			</div>
			<div className="flex px-48 justify-start items-start gap-6">
				<div className="flex px-10 py-3 bg-green-500 bg-opacity-40 justify-start items-start gap-2">
					<div className="text-black text-sm font-inter font-normal">
						Donate
					</div>
				</div>
				<div className="flex px-10 py-3 bg-transparent border border-green-500 justify-start items-start gap-2">
					<div className="text-black text-sm font-inter font-normal">
						Login
					</div>
				</div>
			</div>
		</div>
	);
};

export default HowItWorksSection;
