const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
   validateReview,
   isLoggedIn,
   isReviewAuthor,
} = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");

//Post Review Route
router.post("/", isLoggedIn("Please login to Create Review"), validateReview, wrapAsync(createReview));

//Delete Review Route
router.delete(
   "/:reviewId",
   isLoggedIn("Please login to Delete Review"),
   isReviewAuthor,
   wrapAsync(destroyReview)
);

module.exports = router;
