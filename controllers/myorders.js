const Listing = require("../models/listing");
const Order = require("../models/order");

module.exports.myOrder = async (req, res) => {
   // Assuming you want to fetch orders based on the user's ID
   const userId = req.user ? req.user._id : null; // Ensure you are logged in to fetch orders

   if (!userId) {
      return res.status(403).send("Unauthorized access. Please log in.");
    }
   const orders = await Order.find({ user: userId }).populate("listing");

   res.render("orders/myorders.ejs", { orders });
};
