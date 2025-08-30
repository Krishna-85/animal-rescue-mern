import Organization from "../models/Organization.js";
import Org from "../models/Organization.js";
import User from "../models/User.js";
import { toPoint } from "../utils/geo.js";
import bcrypt from "bcryptjs";

export const createOrg = async (req, res) => {
  try {
    const { name, email, phone, address, serviceRadiusKm, location, password } = req.body;

    // Pehle admin user bnao
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
 
    // Ab org bnao aur admin assign karo
    const org = new Organization({
      name,
      email,
      phone,
      address,
      serviceRadiusKm,
      location,
      admin: adminUser._id,
    });

    await org.save();

    res.json({ ok: true, message: "Organization & admin created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

// List all orgs
export const listOrganizations = async (req, res, next) => {
  try {
    const orgs = await Org.find({});
    res.json({ ok: true, data: orgs });
  } catch (err) {
    next(err);
  }
};

export const listOrgs = async (req, res, next) => {
  try {
    const data = await Org.find({}).sort({ createdAt: -1 });
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
};

export const nearOrgs = async (req, res, next) => {
  try {
    const { lat, lng, km = 10 } = req.query;
    if (!lat || !lng)
      return res.status(400).json({ message: "lat & lng required" });
    const data = await Org.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(km) * 1000
        }
      }
    }).limit(10);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
};
