import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// Define validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

// Define response type
export interface ContactResponse {
  success: boolean;
  error?: string;
}

export const contactRouter = createTRPCRouter({
  submitFeedback: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Log the contact submission (you could store in database instead)
        console.log("Contact form submission:", {
          name: input.name,
          email: input.email,
          message: input.message,
          timestamp: new Date().toISOString(),
        });

        // Here you would typically:
        // 1. Store the message in your database
        // 2. Send an email notification
        // 3. Integrate with a CRM or ticketing system

        // For now, we'll just simulate a successful submission
        return {
          success: true,
        } as ContactResponse;
      } catch (error) {
        console.error("Failed to process contact form:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process your message. Please try again later.",
        });
      }
    }),
}); 