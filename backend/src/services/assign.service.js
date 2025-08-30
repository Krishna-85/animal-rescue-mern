import Organization from "../models/Organization.js";
import nodemailer  from "../utils/sendEmail.js";


export const autoAssignNearest = async (report) => {
  const MAX_KM = Number(process.env.ASSIGNMENT_MAX_DISTANCE_KM || 15);
  const [lng, lat] = report.location.coordinates;

  const org = await Organization.findOne({
    isActive: true,
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: MAX_KM * 1000
      }
    }
  });

  if (!org) return null;

  report.assignedTo = org._id;
  report.status = "assigned";
  await report.save();

  await sendEmail({
    to: org.email,
    subject: "New Animal Rescue Report near you",
    text: `New case assigned near your location.\n\nDescription: ${report.description || "—"}`
  });

  return org;
};
