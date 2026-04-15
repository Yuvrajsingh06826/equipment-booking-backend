export interface BookingInput {
  customerName: string;
  equipmentName: string;
  rentalDate: string;
  rentalDays: number;
  dailyRate: number;
}

export interface BookingRecord {
  equipmentName: string;
  rentalDate: string;
}

const supportedEquipment = [
  "Projector",
  "Camera",
  "Laptop",
  "Microphone",
  "Speaker",
  "Tripod"
];

export const calculateTotalBookingPrice = (
  rentalDays: number,
  dailyRate: number
): number => {
  return rentalDays * dailyRate;
};

export const isFutureRentalDate = (rentalDate: string): boolean => {
  return new Date(rentalDate).getTime() > new Date().getTime();
};

export const isValidRentalDays = (rentalDays: number): boolean => {
  return rentalDays > 0;
};

export const isValidDailyRate = (dailyRate: number): boolean => {
  return dailyRate > 0;
};

export const isSupportedEquipment = (equipmentName: string): boolean => {
  return supportedEquipment.includes(equipmentName);
};

export const isEquipmentAlreadyBooked = (
  existingBooking: BookingRecord | null,
  equipmentName: string,
  rentalDate: string
): boolean => {
  if (!existingBooking) {
    return false;
  }

  return (
    existingBooking.equipmentName === equipmentName &&
    new Date(existingBooking.rentalDate).toISOString() ===
      new Date(rentalDate).toISOString()
  );
};

export const validateBooking = (
  booking: BookingInput,
  existingBooking: BookingRecord | null
): void => {
  if (!isFutureRentalDate(booking.rentalDate)) {
    throw new Error("Rental date must be in the future");
  }

  if (!isValidRentalDays(booking.rentalDays)) {
    throw new Error("Rental days must be greater than 0");
  }

  if (!isValidDailyRate(booking.dailyRate)) {
    throw new Error("Daily rate must be greater than 0");
  }

  if (!isSupportedEquipment(booking.equipmentName)) {
    throw new Error("Selected equipment is not supported");
  }

  if (
    isEquipmentAlreadyBooked(
      existingBooking,
      booking.equipmentName,
      booking.rentalDate
    )
  ) {
    throw new Error("Selected equipment is already booked for this date");
  }
};