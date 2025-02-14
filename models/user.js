const { required } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
   comment: String,
   email: {
      type: String,
      required: true,
   },
   otp: { type: String },
    otpExpires: { type: Date }
});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
