const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("", null), // Allow empty string or null for optional fields
    country: Joi.string().required(),
    location: Joi.string().required(),
    category: Joi.string()
      .valid(
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
      ).required(),
    price: Joi.number().required().min(0),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

const orderSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  from_date: Joi.date().required(),
  to_date: Joi.date().required(),
  payment_method: Joi.string().required(),
  nights: Joi.number().integer().min(1).required().optional(),
  baseCost: Joi.number().min(0).required().optional(),
  totalCost: Joi.number().min(0).required().optional(),
  payment_status: Joi.string().valid("pending", "completed", "canceled").default("pending").optional(),
  stripe_session_id: Joi.string().required().optional(),
  address: Joi.object({
     line1: Joi.string().optional(),
     line2: Joi.string().optional(),
     city: Joi.string().optional(),
     state: Joi.string().optional(),
     postal_code: Joi.string().optional(),
     country: Joi.string().optional(),
  }).optional(),
  card: Joi.object({
     last4: Joi.string().length(4).optional(),
     brand: Joi.string().optional(),
     exp_month: Joi.number().integer().min(1).max(12).optional(),
     exp_year: Joi.number().integer().min(new Date().getFullYear()).optional(),
  }).optional(),
  createdAt: Joi.date().default(() => new Date()), 
});

module.exports = { listingSchema, reviewSchema,orderSchema };