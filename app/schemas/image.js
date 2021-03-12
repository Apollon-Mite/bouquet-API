const Joi = require('joi');

const imageSchema = Joi.object({
  url: Joi.string().required(),
  product_id: Joi.number().integer().positive().required(),
});

module.exports = imageSchema;
