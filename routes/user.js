const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
   signup,
   renderSignupForm,
   renderLoginForm,
   login,
   logout,
   renderOtpForm,
   verifyOtp,
   resendOtp,
   privacyPolicy,
   termsOfServices,
} = require("../controllers/users.js");

router.route("/signup").get(renderSignupForm).post(wrapAsync(signup));
router.route("/verify-otp").get(renderOtpForm).post(wrapAsync(verifyOtp));

router
   .route("/login")
   .get(renderLoginForm)
   .post(
      saveRedirectUrl,
      passport.authenticate("local", {
         failureRedirect: "/login",
         failureFlash: true,
      }),
      login
   );
router.post("/resend-otp", resendOtp);
router.get("/logout", logout);

//Privacy Route
router.route("/privacy").get(privacyPolicy);
router.route("/terms").get(termsOfServices);

module.exports = router;
