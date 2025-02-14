const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 465,
   secure: true,
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
   },
});

const sendOtpEmail = async (email, otp) => {
   let  mail = "wanderlust.co.in";
   await transporter.sendMail({
      from: `"Wanderlust Support" <${mail}>`,
      to: email,
      subject: "Your OTP Code - Secure Login",
      html: `
         <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Your OTP Code</h2>
            <p>Dear User,</p>
            <p>We received a request to access your account. Please use the following One-Time Password (OTP) to complete your login process:</p>
            <h3 style="background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px;">${otp}</h3>
            <p style="color: #777;">This OTP is valid for the next 10 minutes. If you did not request this, please contact our support team immediately.</p>
            <hr />
            <footer style="text-align: center; padding: 20px 0; color: #888;">
               <p style="font-size: 12px;">&copy; ${new Date().getFullYear()} Wanderlust All rights reserved.</p>
               <p><a href="#" style="color: #4CAF50;">Contact Support</a></p>
            </footer>
         </div>
      `,
   });
};

module.exports.renderSignupForm = (req, res) => {
   res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
   try {
      let { username, email, password } = req.body;

      const otp = crypto.randomInt(100000, 999999).toString();
      await sendOtpEmail(email, otp);

      req.session.otp = otp;
      req.session.tempUser = { username, email, password };

      res.redirect("/verify-otp");
   } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
   }
};

module.exports.renderOtpForm = (req, res) => {
   res.render("users/verifyOtp.ejs");
};

module.exports.verifyOtp = async (req, res) => {
   const { otp } = req.body;

   if (otp === req.session.otp) {
      const { username, email, password } = req.session.tempUser;
      const newUser = new User({ username, email });

      await User.register(newUser, password);
      req.login(newUser, (err) => {
         if (err) {
            return next(err);
         }
         delete req.session.otp;
         delete req.session.tempUser;
         req.flash("success", "Welcome to Your App!");
         res.redirect("/listings");
      });
   } else {
      req.flash("error", "Invalid OTP. Please try again.");
      res.redirect("/verify-otp");
   }
};

module.exports.renderLoginForm = (req, res) => {
   res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
   req.flash("success", "Welcome back to Wanderlust!");
   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
   req.logout((err) => {
      if (err) {
         return next(err);
      }
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
   });
};

module.exports.resendOtp = async (req, res) => {
   const { tempUser } = req.session;

   if (!tempUser) {
      req.flash("error", "Session expired. Please sign up again.");
      return res.redirect("/signup");
   }

   const otp = crypto.randomInt(100000, 999999).toString();
   await sendOtpEmail(tempUser.email, otp);

   req.session.otp = otp;
   req.flash("success", "OTP has been resent to your email.");
   res.redirect("/verify-otp");
};


//Privacy Route
module.exports.privacyPolicy = (req,res) => {
   res.render("includes/privacy.ejs")
}
module.exports.termsOfServices = (req,res) => {
   res.render("includes/terms.ejs");
}