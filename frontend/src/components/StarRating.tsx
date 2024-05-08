import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import "./StarRating.scss";


interface StarRatingProps {
	query: string;
	additionalInfo: string;
}

const StarRating: React.FC<StarRatingProps> = ({ query, additionalInfo }) => {
	const [rating, setRating] = useState(0);
	const [hover, setHover] = useState(0);

	const handleClick = (ratingValue: number) => {
		setRating(ratingValue);
		sendFeedback(ratingValue);
	};

	const sendFeedback = async (ratingValue: number) => {
		try {
			const response = await fetch("/api/feedback/query/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// "X-CSRFToken": getCookie("csrftoken"), // Include CSRF token if needed
				},
				body: JSON.stringify({
					query: query, // Replace with your actual query data
					grade: ratingValue,
					additional_information: additionalInfo, // Replace with additional information if needed
				}),
			});
			if (response.ok) {
				const result = await response.json();
				console.log("Feedback submitted successfully:", result);
			} else {
				console.error("Failed to submit feedback:", response.statusText);
			}
		} catch (error) {
			console.error("Error submitting feedback:", error);
		}
	};

	return (
		<div className="star-rating">
			{[...Array(5)].map((star, index) => {
				const ratingValue = index + 1;

				return (
					<label key={index}>
						<input type="radio" name="rating" value={ratingValue} onClick={() => handleClick(ratingValue)} />
						<FontAwesomeIcon icon={solidStar} className="star" color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} size="2x" onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(0)} />
					</label>
				);
			})}
		</div>
	);
};
export default StarRating;
