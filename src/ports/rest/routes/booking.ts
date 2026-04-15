import express from "express";
import bookingInfrastructure from "../../../infrastructure/booking";

const router = express.Router();

router.post("/reserve", async (req, res) => {
  try {
    const response = await bookingInfrastructure.reserveEquipment(req.body);
    return res.status(200).json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(400).json({ message });
  }
});

export default router;