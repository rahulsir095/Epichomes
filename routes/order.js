const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn,validateOrder } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { renderOrderForm, checkout, completeCheckout, cancelCheckout } = require("../controllers/orders.js");

router.route("/").get(isLoggedIn("You must be logged in to reserve your home"), wrapAsync(renderOrderForm));
router.route("/checkout").post(isLoggedIn(),validateOrder, wrapAsync(checkout));

router.route("/complete").get(isLoggedIn(),wrapAsync(completeCheckout));
router.route("/cancel").get(isLoggedIn(),wrapAsync(cancelCheckout));
module.exports = router;
