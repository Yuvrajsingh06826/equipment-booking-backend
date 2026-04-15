import models from "../models";

interface AddBookingInput {
  customerName: string;
  equipmentName: string;
  rentalDate: string;
  rentalDays: number;
  dailyRate: number;
  totalBookingPrice: number;
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
    totalBookingPrice: booking.totalBookingPrice
  });

  return await newBooking.save();
};

export default {
  getBookingByEquipmentAndDate,
  addBooking
};