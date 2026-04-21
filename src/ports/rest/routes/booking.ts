import express from "express";
import bookingInfrastructure from "../../../infrastructure/booking";
import {
  authenticateUser,
  authorizeAdmin,
  AuthenticatedRequest
} from "../../../middleware/auth";

const router = express.Router();

router.post("/reserve/guest", async (req: AuthenticatedRequest, res) => {
  try {
    const bookingData = {
      ...req.body,
      bookingType: "guest" as const
    };

    delete bookingData.userId;

    const response = await bookingInfrastructure.reserveEquipment(bookingData);
    return res.status(200).json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(400).json({ message });
  }
});

router.post(
  "/reserve/registered",
  authenticateUser,
  async (req: AuthenticatedRequest, res) => {
    try {
      const bookingData = {
        ...req.body,
        bookingType: "registered" as const,
        userId: req.user?.userId
      };

      delete bookingData.guestEmail;

      const response = await bookingInfrastructure.reserveEquipment(bookingData);
      return res.status(200).json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      return res.status(400).json({ message });
    }
  }
);

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