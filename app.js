if (process.env.NODE_ENV != "production") {
   require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLAS_URL;

const store = MongoStore.create({
   mongoUrl: dbUrl,
   crypto: {
      secret: process.env.SECRET,
   },
   touchAfter: 24 * 3600,
});

const sessionOptions = {
   store,
   secret: process.env.SECRET,
   resave: false,
   saveUninitialized: true,
   cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
   },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next();
});

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const orderRouter = require("./routes/order.js");
const myOrder = require("./routes/myorder.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
main()
   .then(() => {
      console.log("connection sucessful");
   })
   .catch((err) => {
      console.log(err);
   });
async function main() {
   await mongoose.connect(dbUrl);
}

app.get('/', (req, res) => {
   res.redirect('/listings');
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.use("/listings/:id/orders",orderRouter);
app.use("/myorder",myOrder)

app.all("*", (req, res, next) => {
   next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
   let { status = "500", message = "Something Went Wrong." } = err;
   res.status(status).render("listings/error.ejs", { message });
});

app.listen("8080", () => {
   console.log("server is listinig to port at 8080");
});
