const Joi = require('joi');

const productSchema = Joi.object({
  reference: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  stock: Joi.number().integer().positive().required(),
  price: Joi.string().required(),
  seller_id: Joi.number().integer().positive().required(),
  category_id: Joi.number().integer().positive().required(),
  images: Joi.string().required(),
});

module.exports = productSchema;
