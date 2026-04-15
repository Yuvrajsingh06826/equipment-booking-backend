import {
  calculateTotalBookingPrice,
  isFutureRentalDate,
  isValidRentalDays,
  isValidDailyRate,
  isSupportedEquipment,
  isEquipmentAlreadyBooked,
  validateBooking
} from "../booking";

describe("booking controller", () => {
  it("calculates total booking price correctly", () => {
    expect(calculateTotalBookingPrice(3, 15)).toBe(45);
  });

  it("accepts a future rental date", () => {
    expect(isFutureRentalDate("2099-04-20T10:00:00.000Z")).toBe(true);
  });

  it("rejects a past rental date", () => {
    expect(isFutureRentalDate("2020-04-20T10:00:00.000Z")).toBe(false);
  });

  it("rejects invalid rental days", () => {
    expect(isValidRentalDays(0)).toBe(false);
  });

  it("rejects invalid daily rate", () => {
    expect(isValidDailyRate(-10)).toBe(false);
  });

  it("accepts supported equipment", () => {
    expect(isSupportedEquipment("Projector")).toBe(true);
  });

  it("rejects unsupported equipment", () => {
    expect(isSupportedEquipment("Drone")).toBe(false);
  });

  it("detects already booked equipment", () => {
    const existingBooking = {
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z"
    };

    expect(
      isEquipmentAlreadyBooked(
        existingBooking,
        "Projector",
        "2099-04-20T10:00:00.000Z"
      )
    ).toBe(true);
  });

  it("accepts valid booking input", () => {
    const booking = {
      customerName: "Meet Patel",
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 15
    };

    expect(() => validateBooking(booking, null)).not.toThrow();
  });

  it("rejects past booking date", () => {
    const booking = {
      customerName: "Meet Patel",
      equipmentName: "Projector",
      rentalDate: "2020-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 15
    };

    expect(() => validateBooking(booking, null)).toThrow(
      "Rental date must be in the future"
    );
  });

  it("rejects duplicate equipment booking", () => {
    const booking = {
      customerName: "Meet Patel",
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 15
    };

    const existingBooking = {
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z"
    };

    expect(() => validateBooking(booking, existingBooking)).toThrow(
      "Selected equipment is already booked for this date"
    );
  });
});