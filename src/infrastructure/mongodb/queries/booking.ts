import models from "../models";

interface AddBookingInput {
  customerName: string;
  equipmentName: string;
  rentalDate: string;
  rentalDays: number;
  dailyRate: number;
  totalBookingPrice: number;
  bookingType: "guest" | "registered";
  bookingStatus: "pending" | "accepted" | "declined";
  guestEmail: string;
  userId: string;
  adminNotes: string;
}

export const getBookingByEquipmentAndDate = async (
  equipmentName: string,
  rentalDate: string
) => {
  return await models.Booking.findOne({
    equipmentName,
    rentalDate: new Date(rentalDate)
  }).lean();
};

export const addBooking = async (booking: AddBookingInput) => {
  const newBooking = new models.Booking({
    customerName: booking.customerName,
    equipmentName: booking.equipmentName,
    rentalDate: new Date(booking.rentalDate),
    rentalDays: booking.rentalDays,
    dailyRate: booking.dailyRate,
    totalBookingPrice: booking.totalBookingPrice,
    bookingType: booking.bookingType,
    bookingStatus: booking.bookingStatus,
    guestEmail: booking.guestEmail,
    userId: booking.userId,
    adminNotes: booking.adminNotes
  });

  return await newBooking.save();
};

export const getAllBookings = async () => {
  return await models.Booking.find().sort({ createdAt: -1 }).lean();
};

export const getBookingById = async (bookingId: string) => {
  return await models.Booking.findById(bookingId).lean();
};

export const updateBookingById = async (
  bookingId: string,
  updateData: Record<string, unknown>
) => {
  return await models.Booking.findByIdAndUpdate(bookingId, updateData, {
    new: true
  }).lean();
};

export default {
  getBookingByEquipmentAndDate,
  addBooking,
  getAllBookings,
  getBookingById,
  updateBookingById
};