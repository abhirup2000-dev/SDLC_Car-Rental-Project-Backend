const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["SUV", "Sedan", "Hatchback", "Bike"],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    vehicleImage: {
      type: String, // store URL or filename
      required: true,
      default: "",
    },
    fuelType: {
      type: String,
      required: true,
    },
    seatingCapacity: {
      type: Number,
      required: true,
    },
    location: {
      type: String, // simple city name like "Kolkata"
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    dailyRate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// optional index for faster filtering
vehicleSchema.index({ location: 1, type: 1, isAvailable: 1 });

const VehicleModel = mongoose.model("Vehicle", vehicleSchema);


module.exports = VehicleModel
