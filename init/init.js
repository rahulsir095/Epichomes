require('dotenv').config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("/Users/rahulkumargupta/Desktop/Project/models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
   .then(() => {
      console.log("connected to DB");
   })
   .catch((err) => {
      console.log(err);
   });

   async function main() {
   await mongoose.connect(MONGO_URL);
}

const categories = [
   "Amazing pools",
   "Farms",
   "OMG!",
   "Earth homes",
   "Golfing",
   "Amazing views",
   "Beachfront",
   "Cabins",
   "Rooms",
   "Castle"
];

const initDB = async () => {
   await Listing.deleteMany({});

   const modifiedData = await Promise.all(initData.data.map(async (obj) => {
      try {
         let response = await geocodingClient.forwardGeocode({
            query: `${obj.location}, ${obj.country}`, // Use both location and country
            limit: 1
         }).send();

         const coordinates = response.body.features[0]?.geometry.coordinates || [0, 0];

         return {
            ...obj,
            owner: "66f30c5a681d75cc0a082e78",
            category: categories[Math.floor(Math.random() * categories.length)],
            geometry: {
               type: "Point", // Change as needed
               coordinates: coordinates
            }
         };
      } catch (error) {
         console.error(`Error fetching coordinates for ${obj.location}, ${obj.country}:`, error);
         return {
            ...obj,
            owner: "66f30c5a681d75cc0a082e78",
            category: categories[Math.floor(Math.random() * categories.length)],
            geometry: {
               type: "Point",
               coordinates: [77.216721, 28.644800] // Default coordinates (e.g., for New Delhi)
            }
         };
      }
   }));

   await Listing.insertMany(modifiedData);
   console.log("data was initialized");
};

initDB();
