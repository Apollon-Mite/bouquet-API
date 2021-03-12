const Joi = require('joi');

const sellerSchema = Joi.object({
  gender: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  passwordConfirm: Joi.ref('password'),
  phone_number: Joi.string(),
  street_name: Joi.string().required(),
  street_number: Joi.string().max(4).required(),
  city: Joi.string().required(),
  zipcode: Joi.string().max(5),
  siret: Joi.string().max(14),
  shop_name: Joi.string().required(),
  shop_presentation: Joi.string().required(),
});

module.exports = sellerSchema;
