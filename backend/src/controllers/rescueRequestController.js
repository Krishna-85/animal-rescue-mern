import RescueRequest from "../models/RescueRequest.js";

// Create Rescue Request
export const createRescueRequest = async (req, res) => {
  try {
    const request = await RescueRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Rescue Requests
export const getAllRescueRequests = async (req, res) => {
  try {
    const requests = await RescueRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Rescue Request
export const getRescueRequestById = async (req, res) => {
  try {
    const request = await RescueRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not Found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Rescue Request
export const updateRescueRequest = async (req, res) => {
  try {
    const updated = await RescueRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not Found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Rescue Request
export const deleteRescueRequest = async (req, res) => {
  try {
    const deleted = await RescueRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not Found" });
    res.json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
