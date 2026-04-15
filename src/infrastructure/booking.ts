import {
  BookingInput,
  calculateTotalBookingPrice,
  validateBooking
} from "../controllers/booking";
import {
  addBooking,
  getBookingByEquipmentAndDate
} from "./mongodb/queries/booking";

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
    totalBookingPrice
  });

  return {
    message: "Equipment booked successfully",
    booking: savedBooking
  };
};

export default {
  reserveEquipment
};