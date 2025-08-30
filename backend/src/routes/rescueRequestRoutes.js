import express from "express";
import { createRescueRequest, deleteRescueRequest, getAllRescueRequests, getRescueRequestById, updateRescueRequest } from "../controllers/rescueRequestController.js";
 

const rescueRequestRoutes = express.Router();

rescueRequestRoutes.post("/", createRescueRequest); // new request
rescueRequestRoutes.get("/", getAllRescueRequests); // get all
rescueRequestRoutes.get("/:id", getRescueRequestById); // get single
rescueRequestRoutes.put("/:id", updateRescueRequest); // update
rescueRequestRoutes.delete("/:id", deleteRescueRequest); // delete

export default rescueRequestRoutes;
