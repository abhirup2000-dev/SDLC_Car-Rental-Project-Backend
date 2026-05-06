const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed",
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

// index for faster availability/conflict queries
BookingSchema.index({ vehicleId: 1, startDate: 1, endDate: 1 });

const BookingModel = mongoose.model("Booking", BookingSchema);

module.exports = BookingModel;