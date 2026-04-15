import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true
    },
    equipmentName: {
      type: String,
      required: true
    },
    rentalDate: {
      type: Date,
      required: true
    },
    rentalDays: {
      type: Number,
      required: true
    },
    dailyRate: {
      type: Number,
      required: true
    },
    totalBookingPrice: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Booking", bookingSchema);