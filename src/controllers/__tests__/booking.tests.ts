import {
  calculateTotalBookingPrice,
  isFutureRentalDate,
  isValidRentalDays,
  isValidDailyRate,
  isSupportedEquipment,
  isEquipmentAlreadyBooked,
  isValidBookingType,
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

  it("accepts valid rental days", () => {
    expect(isValidRentalDays(3)).toBe(true);
  });

  it("rejects invalid daily rate", () => {
    expect(isValidDailyRate(-10)).toBe(false);
  });

  it("accepts valid daily rate", () => {
    expect(isValidDailyRate(15)).toBe(true);
  });

  it("accepts supported equipment", () => {
    expect(isSupportedEquipment("Projector")).toBe(true);
  });

  it("rejects unsupported equipment", () => {
    expect(isSupportedEquipment("Drone")).toBe(false);
  });

  it("returns false when there is no existing booking", () => {
    expect(
      isEquipmentAlreadyBooked(null, "Projector", "2099-04-20T10:00:00.000Z")
    ).toBe(false);
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

  it("accepts undefined booking type", () => {
    expect(isValidBookingType(undefined)).toBe(true);
  });

  it("accepts guest booking type", () => {
    expect(isValidBookingType("guest")).toBe(true);
  });

  it("accepts registered booking type", () => {
    expect(isValidBookingType("registered")).toBe(true);
  });

  it("rejects invalid booking type in helper", () => {
    expect(isValidBookingType("invalid")).toBe(false);
  });

  it("accepts valid booking input", () => {
    const booking = {
      customerName: "Yuvraj Singh",
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 15
    };

    expect(() => validateBooking(booking, null)).not.toThrow();
  });

  it("rejects past booking date", () => {
    const booking = {
      customerName: "Yuvraj Singh",
      equipmentName: "Projector",
      rentalDate: "2020-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 15
    };

    expect(() => validateBooking(booking, null)).toThrow(
      "Rental date must be in the future"
    );
  });

  it("rejects invalid rental days in validation", () => {
    const booking = {
      customerName: "Yuvraj Singh",
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z",
      rentalDays: 0,
      dailyRate: 15
    };

    expect(() => validateBooking(booking, null)).toThrow(
      "Rental days must be greater than 0"
    );
  });

  it("rejects invalid daily rate in validation", () => {
    const booking = {
      customerName: "Yuvraj Singh",
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 0
    };

    expect(() => validateBooking(booking, null)).toThrow(
      "Daily rate must be greater than 0"
    );
  });

  it("rejects unsupported equipment in validation", () => {
    const booking = {
      customerName: "Yuvraj Singh",
      equipmentName: "Drone",
      rentalDate: "2099-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 15
    };

    expect(() => validateBooking(booking, null)).toThrow(
      "Selected equipment is not supported"
    );
  });

  it("rejects duplicate equipment booking", () => {
    const booking = {
      customerName: "Yuvraj Singh",
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

  it("rejects invalid booking type in validation", () => {
    const booking = {
      customerName: "Yuvraj Singh",
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 15,
      bookingType: "invalid" as unknown as "guest" | "registered"
    };

    expect(() => validateBooking(booking, null)).toThrow(
      "Booking type must be guest or registered"
    );
  });

  it("rejects guest booking without guest email", () => {
    const booking = {
      customerName: "Yuvraj Singh",
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 15,
      bookingType: "guest" as "guest" | "registered"
    };

    expect(() => validateBooking(booking, null)).toThrow(
      "Guest email is required for guest booking"
    );
  });

  it("rejects registered booking without user id", () => {
    const booking = {
      customerName: "Yuvraj Singh",
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 15,
      bookingType: "registered" as "guest" | "registered"
    };

    expect(() => validateBooking(booking, null)).toThrow(
      "User id is required for registered booking"
    );
  });

  it("accepts valid guest booking with guest email", () => {
    const booking = {
      customerName: "Yuvraj Singh",
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 15,
      bookingType: "guest" as "guest" | "registered",
      guestEmail: "yuvraj@example.com"
    };

    expect(() => validateBooking(booking, null)).not.toThrow();
  });

  it("accepts valid registered booking with user id", () => {
    const booking = {
      customerName: "Yuvraj Singh",
      equipmentName: "Projector",
      rentalDate: "2099-04-20T10:00:00.000Z",
      rentalDays: 3,
      dailyRate: 15,
      bookingType: "registered" as "guest" | "registered",
      userId: "user123"
    };

    expect(() => validateBooking(booking, null)).not.toThrow();
  });
});