// adminRoutes.js
import express from "express";
import Report from "../models/Report.js";
import Organization from "../models/Organization.js";

const router = express.Router();

/**
 * 🔹 Get reports only in radius of this organization
 */
router.get("/requests/:orgId", async (req, res) => {
  try {
    const { orgId } = req.params;
    const org = await Organization.findById(orgId);

    if (!org) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }

    // 50km radius (adjust as per need)
    const reports = await Report.find({
      location: {
        $near: {
          $geometry: org.location,
          $maxDistance: 50000
        }
      },
      status: ["pending", "assigned"]
    });

    res.json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 🔹 Accept request by this gaushala
 */
router.put("/requests/:reportId/accept/:orgId", async (req, res) => {
  try {
    const { reportId, orgId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }

    // Update report
    report.status = "assigned";
    report.assignedTo = org._id;
    await report.save();

    res.json({
      success: true,
      message: "Request accepted and assigned successfully",
      data: report
    });
  } catch (error) {
    console.error("Error accepting report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
