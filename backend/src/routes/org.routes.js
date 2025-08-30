import { Router } from "express";
import { createOrg, listOrgs, nearOrgs } from "../controllers/org.controller.js";
const orgRoutes = Router();

orgRoutes.post("/add", createOrg);
orgRoutes.get("/", listOrgs);
orgRoutes.get("/near", nearOrgs);
export default orgRoutes;
