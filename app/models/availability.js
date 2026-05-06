const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
  },
});

// prevent duplicate entries for same vehicle + date
AvailabilitySchema.index({ vehicleId: 1, date: 1 }, { unique: true });

const AvailabilityModel = mongoose.model("Availability", AvailabilitySchema);

module.exports = AvailabilityModel;