// services/notify.service.js
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const notifyOrganization = (org, report) => {
  if (!org || !org.phone) return;

  client.messages.create({
    body: `🚨 Injured animal reported near you!\nLocation: https://maps.google.com/?q=${report.location.coordinates[1]},${report.location.coordinates[0]}\nDesc: ${report.description}`,
    from: process.env.TWILIO_PHONE,
    to: org.phone
  });
};
