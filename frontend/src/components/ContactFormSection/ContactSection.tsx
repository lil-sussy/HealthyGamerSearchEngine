import styles from "./ContactSection.module.scss";
import { Button, Input, Textarea } from "@nextui-org/react";

import React, { useState } from "react";
import axios from "axios";

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

		try {
			await axios.post("/api/contact/feedback", { name, email, message });
			setSuccess("Thank you for your feedback!");
			setName("");
			setEmail("");
			setMessage("");
		} catch (err) {
			setError("Something went wrong. Please try again later.");
		}
	};

	return (
		<div className={styles.CenteringDiv}>
			<div className={styles.FeedbackSection}>
				<div className={styles.WhiteContainer}>
					<div className={styles.ContentContainer}>
						<div className={styles.FormContainer}>
							<div className={styles.AnyQuestionsOrFeedback}>Any questions or Feedback?</div>
							<div className={styles.Rectangle4}></div>
							<form className={styles.Form} onSubmit={handleSubmit}>
								<div className={styles.Frame13}>
									<Input name="Name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
									<Input name="Email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
								</div>
								<Textarea name="Message" placeholder="Your message" height="300px" size="lg" value={message} onChange={(e) => setMessage(e.target.value)} />
								<Button type="submit">Submit</Button>
								{error && <div className={styles.Error}>{error}</div>}
								{success && <div className={styles.Success}>{success}</div>}
							</form>
						</div>
						<img className={styles.DrkConfident} src="./dr k confident 2.png" alt="Dr K confident" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactSection;