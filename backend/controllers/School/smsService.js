import Twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error("Twilio credentials are missing");
}

const client = new Twilio(accountSid, authToken);

// Utility to format phone numbers
const formatPhoneNumber = (number) => {
  if (!number.startsWith("+")) {
    // Assume Indian number if not already formatted
    return `+91${number}`;
  }
  return number;
};

// Function to send SMS
export const sendSms = (to, message) => {
  const formattedTo = formatPhoneNumber(to); // Ensure the number is in E.164 format
  return client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedTo,
    })
    .then((message) => console.log(`Message sent: ${message.sid}`))
    .catch((error) => {
      console.error("Error sending message:", error.message);
      console.error("Full error details:", error.stack || error);
    });
};
