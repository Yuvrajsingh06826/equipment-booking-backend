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
    },
    bookingType: {
      type: String,
      enum: ["guest", "registered"],
      required: true,
      default: "guest"
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      required: true,
      default: "pending"
    },
    guestEmail: {
      type: String,
      required: false
    },
    userId: {
      type: String,
      required: false
    },
    adminNotes: {
      type: String,
      required: false,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Booking", bookingSchema);