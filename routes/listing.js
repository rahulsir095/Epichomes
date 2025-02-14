const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });
const {
   index,
   renderNewForm,
   showListnig, 
   createListing,
   renderEditForm,
   updateListing,
   destroyListing,
   searchFilter,
} = require("../controllers/listings.js");

router
   .route("/")
   .get(wrapAsync(index))
   .post(
      isLoggedIn(),
      upload.single("listing[image]"),
      validateListing,
      wrapAsync(createListing)
   );

//New Route
router.get("/new", isLoggedIn("You must be logged in to list your home"), renderNewForm);

//search route
router.get("/search",searchFilter);

router
   .route("/:id")
   .get(wrapAsync(showListnig))
   .put(isLoggedIn(), isOwner,upload.single("listing[image]"), validateListing, wrapAsync(updateListing))
   .delete(isLoggedIn(), isOwner, wrapAsync(destroyListing));

//Edit route
router.get("/:id/edit", isLoggedIn(), isOwner, wrapAsync(renderEditForm));

module.exports = router;
