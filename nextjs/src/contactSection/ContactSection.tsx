"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { Button, Input, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import { api } from "@/trpc/react";


const ContactSection: React.FC = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Get the tRPC mutation
	const submitFeedback = api.contact.submitFeedback.useMutation({
		onSuccess: () => {
			setSuccess("Thank you for your feedback!");
			setName("");
			setEmail("");
			setMessage("");
			setIsSubmitting(false);
		},
		onError: (error) => {
			setError(error.message || "Something went wrong. Please try again later.");
			setIsSubmitting(false);
		}
	});

	const validateEmail = (email: string): boolean => {
		const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
		return re.test(String(email).toLowerCase());
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setIsSubmitting(true);

		if (!name || !email || !message) {
			setError("All fields are required.");
			setIsSubmitting(false);
			return;
		}

		if (!validateEmail(email)) {
			setError("Please enter a valid email address.");
			setIsSubmitting(false);
			return;
		}

		// Submit the form using tRPC
		submitFeedback.mutate({ name, email, message });
	};

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
	};

	return (
		<div className="w-full flex justify-center items-center">
			<div className="w-4/5 p-8 mt-8 mx-auto bg-background bg-opacity-50 rounded-3xl backdrop-blur-lg inline-flex flex-col justify-start items-start gap-2">
				<div className="p-16 bg-background shadow-lg rounded-3xl flex flex-col justify-start items-start gap-2">
					<div className="inline-flex justify-start items-center gap-20">
						<div className="w-4/5 inline-flex flex-col justify-center items-start gap-20 relative">
							<div className="w-full text-black text-4xl font-poppins font-medium leading-tight">Any questions or Feedback?</div>
							{/* <div className="absolute top-24 z-0 left-[-1rem] w-96 h-9 bg-green-500 bg-opacity-40 rounded-lg" /> */}
							<form className="self-stretch h-80 flex flex-col justify-start items-end gap-8" onSubmit={handleSubmit}>
								<div className="self-stretch inline-flex justify-start items-end gap-12">
									<Input 
										name="Name" 
										placeholder="Your name" 
										value={name} 
										onChange={handleNameChange} 
										disabled={isSubmitting}
									/>
									<Input 
										name="Email" 
										placeholder="Your email" 
										value={email} 
										onChange={handleEmailChange} 
										disabled={isSubmitting}
									/>
								</div>
								<TextArea 
									name="Message" 
									placeholder="Your message" 
									style={{ height: '300px' }}
									value={message} 
									onChange={handleMessageChange} 
									disabled={isSubmitting}
								/>
								<Button 
									type="primary" 
									htmlType="submit" 
									loading={isSubmitting}
								>
									Submit
								</Button>
								{error && <div className="text-red-500">{error}</div>}
								{success && <div className="text-green-500">{success}</div>}
							</form>
						</div>
						<img className="w-80" src="./images/dr k confident 2.png" alt="Dr K confident" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactSection;
