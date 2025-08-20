import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async (to, message) => {
  try {
    const msg = await client.messages.create({
      body: message,
      to: to,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SID
    });
    console.log("📩 SMS sent:", msg.sid);
    console.log("📞 To:", to);
    return msg;
  } catch (err) {
    console.error("❌ SMS error:", err.message);
    throw err;
  }
};
