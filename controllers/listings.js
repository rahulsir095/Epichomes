const Listing = require("../models/listing");
require('dotenv').config();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { getCategoryImageUrl } = require("../public/js/category");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const { cloudinary } =require("../cloudconfig");

module.exports.index = async (req, res) => {
   const { category } = req.query; 
   let filter = {};

   if (category) {
      filter.category = category; 
   }
   let allListings = await Listing.find(filter);
   res.render('./listings/index.ejs', { allListings, getCategoryImageUrl, category, search: "" });
};

module.exports.searchFilter = async (req, res) => {
   const { search } = req.query;
   let filter = {};
 
   if (search) {
     filter.country = { $regex: search, $options: "i" };
   }
   
   let allListings = await Listing.find(filter);
   res.render('./listings/index.ejs', { allListings, getCategoryImageUrl, category: "", search: search || "" });
};
 
module.exports.renderNewForm = (req, res) => {
   res.render("listings/new.ejs");
};
module.exports.showListnig = async (req, res) => {
   let { id } = req.params;
   const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
   if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
   }
   res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
   let url = req.file.path;
   let filename = req.file.filename;
   let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
      .send()

   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;
   newListing.image = { url, filename };
   newListing.geometry = response.body.features[0].geometry;
   await newListing.save();
   req.flash("success", "New listing created!");
   res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
   let { id } = req.params;
   const listing = await Listing.findById(id);
   if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
   }
   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_180,w_300")
   res.render("listings/edit.ejs", { listing ,originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
   let { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
   }
   req.flash("success", "Listing Updated!");
   res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
   let { id } = req.params;
   let post = await Listing.findById(id);
   
   if (post && post.image && post.image.url) {
      const imageUrl = post.image.url;
      const imagePublicId = "wanderlust_DEV/" + imageUrl.split('/').pop().split('.')[0];
      let result = await cloudinary.uploader.destroy(imagePublicId);
   }
   await Listing.findByIdAndDelete(id);
   req.flash("success", "Listing Deleted!");
   res.redirect("/listings");
}
