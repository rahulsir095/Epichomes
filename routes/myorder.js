const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { myOrder } = require("../controllers/myorders.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.route("/").get(isLoggedIn("Login to see your orders"), wrapAsync(myOrder));

module.exports = router;
