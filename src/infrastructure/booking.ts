import {
  BookingInput,
  calculateTotalBookingPrice,
  validateBooking
} from "../controllers/booking";
import {
  addBooking,
  getAllBookings,
  getBookingByEquipmentAndDate,
  getBookingById,
  updateBookingById
} from "./mongodb/queries/booking";
import { logInfo } from "../utils/logger";

const reserveEquipment = async (booking: BookingInput) => {
  const existingBookingFromDb = await getBookingByEquipmentAndDate(
    booking.equipmentName,
    booking.rentalDate
  );

  const existingBooking = existingBookingFromDb
    ? {
        equipmentName: existingBookingFromDb.equipmentName,
        rentalDate: new Date(existingBookingFromDb.rentalDate).toISOString()
      }
    : null;

  validateBooking(booking, existingBooking);

  const totalBookingPrice = calculateTotalBookingPrice(
    booking.rentalDays,
    booking.dailyRate
  );

  const savedBooking = await addBooking({
    ...booking,
    bookingType: booking.bookingType ?? "guest",
    bookingStatus: "pending",
    guestEmail: booking.guestEmail ?? "",
    userId: booking.userId ?? "",
    adminNotes: "",
    totalBookingPrice
  });

  logInfo("New booking request created");

  return {
    message: "Equipment booked successfully",
    booking: savedBooking
  };
};

const getAllBookingRequests = async () => {
  const bookings = await getAllBookings();

  logInfo("Fetched all booking requests");

  return {
    message: "All booking requests fetched successfully",
    bookings
  };
};

const acceptBookingRequest = async (bookingId: string) => {
  const booking = await getBookingById(bookingId);

  if (!booking) {
    throw new Error("Booking request not found");
  }

  const updatedBooking = await updateBookingById(bookingId, {
    bookingStatus: "accepted"
  });

  logInfo(`Booking request accepted: ${bookingId}`);

  return {
    message: "Booking request accepted successfully",
    booking: updatedBooking
  };
};

const declineBookingRequest = async (
  bookingId: string,
  adminNotes: string
) => {
  const booking = await getBookingById(bookingId);

  if (!booking) {
    throw new Error("Booking request not found");
  }

  const updatedBooking = await updateBookingById(bookingId, {
    bookingStatus: "declined",
    adminNotes
  });

  logInfo(`Booking request declined: ${bookingId}`);

  return {
    message: "Booking request declined successfully",
    booking: updatedBooking
  };
};

const editBookingRequest = async (
  bookingId: string,
  updateData: Partial<BookingInput>
) => {
  const booking = await getBookingById(bookingId);

  if (!booking) {
    throw new Error("Booking request not found");
  }

  const currentRentalDays =
    typeof booking.rentalDays === "number" ? booking.rentalDays : 0;
  const currentDailyRate =
    typeof booking.dailyRate === "number" ? booking.dailyRate : 0;

  const updatedRentalDays =
    typeof updateData.rentalDays === "number"
      ? updateData.rentalDays
      : currentRentalDays;

  const updatedDailyRate =
    typeof updateData.dailyRate === "number"
      ? updateData.dailyRate
      : currentDailyRate;

  const updatedTotalBookingPrice = calculateTotalBookingPrice(
    updatedRentalDays,
    updatedDailyRate
  );

  const updatedBooking = await updateBookingById(bookingId, {
    ...updateData,
    totalBookingPrice: updatedTotalBookingPrice
  });

  logInfo(`Booking request updated: ${bookingId}`);

  return {
    message: "Booking request updated successfully",
    booking: updatedBooking
  };
};

export default {
  reserveEquipment,
  getAllBookingRequests,
  acceptBookingRequest,
  declineBookingRequest,
  editBookingRequest
};