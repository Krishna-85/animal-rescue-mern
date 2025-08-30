import Report from "../models/Report.js";
import { toPoint } from "../utils/geo.js";
import { autoAssignNearest } from "../services/assign.service.js";
import Org from "../models/Organization.js";
import sendEmail from "../utils/sendEmail.js";

// 📌 Haversine formula (km me distance)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // radius of Earth (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const createReport = async (req, res, next) => {
  try {
    console.log("📩 createReport API called with body:", req.body);

    // Convert lat/lng to numbers
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);
    const { description, reporterName, reporterPhone, address } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat & lng required" });
    }

    // Image handling (Cloudinary URL)
    const images = req.fileUrl ? [req.fileUrl] : [];

    // 1️⃣ Create report
    const report = await Report.create({
      description,
      images,
      reporter: { name: reporterName, phone: reporterPhone },
      address,
      location: toPoint(lat, lng), // toPoint should handle [lng, lat]
    });

    console.log("📌 Report saved:", report);

    // 2️⃣ Fetch active orgs within 5 km radius
    const orgs = await Org.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 5000, // 5 km
        },
      },
    });

    console.log("📍 Nearby orgs found (raw):", orgs);

    // 3️⃣ Filter orgs by their service radius
    const nearbyOrgs = orgs.filter((org) => {
      const [orgLng, orgLat] = org.location.coordinates;
      const distance = getDistanceFromLatLonInKm(lat, lng, orgLat, orgLng);
      return distance <= org.serviceRadiusKm;
    });

    console.log(
      "📍 Nearby orgs filtered (within radius):",
      nearbyOrgs.map((o) => o.name)
    );

    // 4️⃣ Send email notifications
    for (const org of nearbyOrgs) {
      await sendEmail({
        to: org.email,
        subject: "🚨 New Animal Rescue Alert",
        text: `🐾 A new rescue case has been reported near your area.

📌 Location: https://maps.google.com/?q=${lat},${lng}
📝 Description: ${report.description || "—"}
👤 Reporter: ${report.reporter?.name || "N/A"} (${
          report.reporter?.phone || "N/A"
        })
🏠 Address: ${report.address || "Not provided"}
`,
      });
    }

    res.status(201).json({
      ok: true,
      data: report,
      notifiedOrgs: nearbyOrgs.map((o) => o.name),
    });
  } catch (e) {
    console.error("❌ Error in createReport:", e);
    next(e);
  }
};


export const listReports = async (req, res, next) => {
  try {
    const data = await Report.find({})
      .populate("assignedTo")
      .sort({ createdAt: -1 });
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
};

export const getReport = async (req, res, next) => {
  try {
    const data = await Report.findById(req.params.id).populate("assignedTo");
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = [
      "pending",
      "assigned",
      "en_route",
      "completed",
      "cancelled"
    ];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Not found" });
    report.status = status;
    await report.save();
    res.json({ ok: true, data: report });
  } catch (e) {
    next(e);
  }
};
