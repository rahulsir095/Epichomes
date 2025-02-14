const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
   },
   name: { type: String, required: true },
   email: { type: String, required: true },
   phone: { type: String, required: true },
   from_date: { type: Date, required: true },
   to_date: { type: Date, required: true },
   payment_method: { type: String, required: true },
   nights: { type: Number, required: true },
   baseCost: { type: Number, required: true },
   totalCost: { type: Number, required: true },
   payment_status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
   },
   stripe_session_id: { type: String, required: true },
   // Additional fields for storing address and card details
   address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
   },
   card: {
      last4: String,
      brand: String,
      exp_month: Number,
      exp_year: Number,
   },
   createdAt: { type: Date, default: Date.now },
});

const Checkout = mongoose.model("Checkout", checkoutSchema);

module.exports = Checkout;
