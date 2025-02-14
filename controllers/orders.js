const Listing = require("../models/listing");
const User = require("../models/user");
const Checkout = require("../models/order");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

module.exports.renderOrderForm = async (req, res) => {
   let { id } = req.params;
   const listing = await Listing.findById(id);
   if (!listing) {
    req.flash("error", "Listing not found!");
   }
   res.render("orders/reserve.ejs", { listing });
};

module.exports.checkout = async (req, res) => {
   let { id } = req.params;
   let { name, email, phone, from_date, to_date, payment_method } = req.body;

   try {
       const listing = await Listing.findById(id);
       if (!listing) {
         req.flash("error", "Listing not found!");
       }

       const fromDate = new Date(from_date);
       const toDate = new Date(to_date);

       // Check if date parsing was successful
       if (isNaN(fromDate) || isNaN(toDate)) {
        req.flash("error", "Invalid date format");
       }

       const pricePerNight = listing.price;
       const nights = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
       const baseCost = nights * pricePerNight;
       const totalCost = Math.round(baseCost * 1.18); // Adding 18% tax or fees

       // Build dynamic URLs
       const baseUrl = `${req.protocol}://${req.get("host")}`;
       const success_url = `${baseUrl}/listings/${id}/orders/complete?session_id={CHECKOUT_SESSION_ID}`;
       const cancel_url = `${baseUrl}/listings/${id}/orders/cancel`;

       const session = await stripe.checkout.sessions.create({
           mode: "payment",
           line_items: [
               {
                   price_data: {
                       currency: "inr",
                       product_data: {
                           name: listing.title,
                       },
                       unit_amount: totalCost * 100,
                   },
                   quantity: 1,
               },
           ],
           metadata: {
               listing_id: id,
               user_id: req.user ? req.user._id.toString() : null,
               from_date: fromDate.toISOString(),
               to_date: toDate.toISOString(),
               name: name.toString(),
               email: email.toString(),
               phone: phone.toString(),
           },
           shipping_address_collection: {
               allowed_countries: [
                   "IN", "US", "CA", "GB", "AU", "BR", "DE", "FR",
                   "JP", "CN", "IT", "ES", "MX", "NL", "SE", "NO",
                   "FI", "DK", "BE", "CH", "AT", "IE", "PT", "SG",
                   "HK", "KR", "RU", "ZA",
               ],
           },
           success_url: success_url,
           cancel_url: cancel_url,
       });

       // Save checkout details in the database
       const checkoutData = new Checkout({
           user: req.user._id,
           listing: id,
           name: name,
           email: email,
           phone: phone,
           from_date: fromDate,
           to_date: toDate,
           payment_method,
           nights,
           baseCost,
           totalCost,
           payment_status: "pending",
           stripe_session_id: session.id,
       });

       await checkoutData.save(); 

       if (session.url) {
           return res.redirect(303, session.url); 
       }
       req.flash("error", "Unable to create checkout session");
   } catch (error) {
       console.error("Error during checkout:", error);
       req.flash("error", "Server error");
   }
};


module.exports.completeCheckout = async (req, res) => {
   const session_id = req.query.session_id;
   const [session, lineItems] = await Promise.all([
      stripe.checkout.sessions.retrieve(session_id, {
         expand: ["payment_intent.payment_method"],
      }),
      stripe.checkout.sessions.listLineItems(session_id),
   ]);

   const paymentIntent = session.payment_intent;
   const paymentMethod = paymentIntent.payment_method;

   // Extracting customer details and card information
   const customerDetails = session.customer_details;
   const cardDetails = paymentMethod.card;

   // Fetch and update the pending checkout
   const checkoutData = await Checkout.findOneAndUpdate(
      { stripe_session_id: session_id, payment_status: "pending" },
      {
         payment_status: session.payment_status,
         address: {
            line1: customerDetails.address.line1,
            line2: customerDetails.address.line2,
            city: customerDetails.address.city,
            state: customerDetails.address.state,
            postal_code: customerDetails.address.postal_code,
            country: customerDetails.address.country,
         },
         card: {
            last4: cardDetails.last4,
            brand: cardDetails.brand,
            exp_month: cardDetails.exp_month,
            exp_year: cardDetails.exp_year,
         },
      },
      { new: true }
   );

   res.render("orders/complete.ejs", { session, lineItems });
};

module.exports.cancelCheckout = async (req, res) => {
   const session_id = req.query.session_id;

   // Update checkout status to canceled
   await Checkout.findOneAndUpdate(
      { stripe_session_id: session_id },
      { payment_status: "canceled" }
   );
   res.render("orders/cancel.ejs", { session_id });
};
