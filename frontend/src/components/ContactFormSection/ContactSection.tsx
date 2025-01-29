import React, { useState } from "react";
import { Button, Input, Textarea } from "@nextui-org/react";
import { sendContactFeedback } from "../../requests";

const ContactSection = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const validateEmail = (email: string) => {
		const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
		return re.test(String(email).toLowerCase());
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!name || !email || !message) {
			setError("All fields are required.");
			return;
		}

		if (!validateEmail(email)) {
			setError("Please enter a valid email address.");
			return;
		}

		const [result, error] = await sendContactFeedback(name, email, message);
		if (error) {
			setError("Something went wrong. Please try again later.");
		} else {
			setSuccess("Thank you for your feedback!");
			setName("");
			setEmail("");
			setMessage("");
		}
	};

	return (
		<div className="w-full flex justify-center items-center">
			<div className="w-4/5 p-8 mt-8 mx-auto bg-white bg-opacity-50 rounded-3xl backdrop-blur-lg inline-flex flex-col justify-start items-start gap-2">
				<div className="p-16 bg-white shadow-lg rounded-3xl flex flex-col justify-start items-start gap-2">
					<div className="inline-flex justify-start items-center gap-20">
						<div className="w-4/5 inline-flex flex-col justify-center items-start gap-20 relative">
							<div className="w-full text-black text-4xl font-poppins font-medium leading-tight">
								Any questions or Feedback?
							</div>
							<div className="absolute top-24 z-0 left-[-1rem] w-96 h-9 bg-green-500 bg-opacity-40 rounded-lg" />
							<form className="self-stretch h-80 flex flex-col justify-start items-end gap-8" onSubmit={handleSubmit}>
								<div className="self-stretch inline-flex justify-start items-end gap-12">
									<Input name="Name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
									<Input name="Email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
								</div>
								<Textarea name="Message" placeholder="Your message" height="300px" size="lg" value={message} onChange={(e) => setMessage(e.target.value)} />
								<Button type="submit">Submit</Button>
								{error && <div className="text-red-500">{error}</div>}
								{success && <div className="text-green-500">{success}</div>}
							</form>
						</div>
						<img className="w-80" src="./dr k confident 2.png" alt="Dr K confident" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactSection;