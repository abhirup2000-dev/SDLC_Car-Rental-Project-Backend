const mongoose = require("mongoose");

const MaintenanceLogSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  performedOn: {
    type: Date,
    required: true,
  },
  performedBy: {
    type: String,
    required: true,
    trim: true,
  },
});

const MaintenanceLogModel = mongoose.model(
  "MaintenanceLog",
  MaintenanceLogSchema,
);

module.exports = MaintenanceLogModel;
