import {
  BookingInput,
  calculateTotalBookingPrice,
  validateBooking
} from "../controllers/booking";
import { logInfo } from "../utils/logger";

type BookingStatus = "pending" | "accepted" | "declined";

interface StoredBooking extends BookingInput {
  id: string;
  bookingType: "guest" | "registered";
  bookingStatus: BookingStatus;
  guestEmail: string;
  userId: string;
  adminNotes: string;
  totalBookingPrice: number;
  createdAt: string;
}

const bookingStore: StoredBooking[] = [];

const createBookingId = () => {
  return `booking_${bookingStore.length + 1}`;
};

const reserveEquipment = async (booking: BookingInput) => {
  const existingBooking = bookingStore.find(
    (savedBooking) =>
      savedBooking.equipmentName === booking.equipmentName &&
      new Date(savedBooking.rentalDate).toISOString() ===
        new Date(booking.rentalDate).toISOString()
  );

  validateBooking(
    booking,
    existingBooking
      ? {
          equipmentName: existingBooking.equipmentName,
          rentalDate: existingBooking.rentalDate
        }
      : null
  );

  const totalBookingPrice = calculateTotalBookingPrice(
    booking.rentalDays,
    booking.dailyRate
  );

  const savedBooking: StoredBooking = {
    ...booking,
    id: createBookingId(),
    bookingType: booking.bookingType ?? "guest",
    bookingStatus: "pending",
    guestEmail: booking.guestEmail ?? "",
    userId: booking.userId ?? "",
    adminNotes: "",
    totalBookingPrice,
    createdAt: new Date().toISOString()
  };

  bookingStore.unshift(savedBooking);

  logInfo("New booking request created in memory");

  return {
    message: "Equipment booked successfully",
    booking: savedBooking
  };
};

const getAllBookingRequests = async () => {
  logInfo("Fetched all booking requests from memory");

  return {
    message: "All booking requests fetched successfully",
    bookings: bookingStore
  };
};

const acceptBookingRequest = async (bookingId: string) => {
  const booking = bookingStore.find((savedBooking) => savedBooking.id === bookingId);

  if (!booking) {
    throw new Error("Booking request not found");
  }

  booking.bookingStatus = "accepted";

  logInfo(`Booking request accepted: ${bookingId}`);

  return {
    message: "Booking request accepted successfully",
    booking
  };
};

const declineBookingRequest = async (
  bookingId: string,
  adminNotes: string
) => {
  const booking = bookingStore.find((savedBooking) => savedBooking.id === bookingId);

  if (!booking) {
    throw new Error("Booking request not found");
  }

  booking.bookingStatus = "declined";
  booking.adminNotes = adminNotes;

  logInfo(`Booking request declined: ${bookingId}`);

  return {
    message: "Booking request declined successfully",
    booking
  };
};

const editBookingRequest = async (
  bookingId: string,
  updateData: Partial<BookingInput>
) => {
  const booking = bookingStore.find((savedBooking) => savedBooking.id === bookingId);

  if (!booking) {
    throw new Error("Booking request not found");
  }

  const updatedRentalDays =
    typeof updateData.rentalDays === "number"
      ? updateData.rentalDays
      : booking.rentalDays;

  const updatedDailyRate =
    typeof updateData.dailyRate === "number"
      ? updateData.dailyRate
      : booking.dailyRate;

  const updatedBooking = {
    ...booking,
    ...updateData,
    totalBookingPrice: calculateTotalBookingPrice(
      updatedRentalDays,
      updatedDailyRate
    )
  };

  const bookingIndex = bookingStore.findIndex(
    (savedBooking) => savedBooking.id === bookingId
  );

  bookingStore[bookingIndex] = updatedBooking;

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