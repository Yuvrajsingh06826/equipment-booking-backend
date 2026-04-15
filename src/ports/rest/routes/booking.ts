import express from "express";
import bookingInfrastructure from "../../../infrastructure/booking";
import {
  authenticateUser,
  authorizeAdmin,
  AuthenticatedRequest
} from "../../../middleware/auth";

const router = express.Router();

router.post("/reserve", async (req: AuthenticatedRequest, res) => {
  try {
    const bookingData = { ...req.body };

    if (bookingData.bookingType === "registered") {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Authentication required for registered booking"
        });
      }

      const token = authHeader.split(" ")[1];

      try {
        req.headers.authorization = `Bearer ${token}`;
        await new Promise<void>((resolve, reject) => {
          authenticateUser(req, res, (error?: unknown) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      } catch (error) {
        return;
      }

      bookingData.userId = req.user?.userId;
    }

    const response = await bookingInfrastructure.reserveEquipment(bookingData);
    return res.status(200).json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(400).json({ message });
  }
});

router.get(
  "/requests",
  authenticateUser,
  authorizeAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const response = await bookingInfrastructure.getAllBookingRequests();
      return res.status(200).json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      return res.status(400).json({ message });
    }
  }
);

router.patch(
  "/requests/:id/accept",
  authenticateUser,
  authorizeAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const response = await bookingInfrastructure.acceptBookingRequest(
        req.params.id
      );
      return res.status(200).json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      return res.status(400).json({ message });
    }
  }
);

router.patch(
  "/requests/:id/decline",
  authenticateUser,
  authorizeAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const response = await bookingInfrastructure.declineBookingRequest(
        req.params.id,
        req.body.adminNotes ?? ""
      );
      return res.status(200).json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      return res.status(400).json({ message });
    }
  }
);

router.patch(
  "/requests/:id/edit",
  authenticateUser,
  authorizeAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const response = await bookingInfrastructure.editBookingRequest(
        req.params.id,
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      return res.status(400).json({ message });
    }
  }
);

export default router;