const Joi = require('joi');

const customerSchema = Joi.object({
  gender: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  passwordConfirm: Joi.ref('password'),
  phone_number: Joi.string().required(),
  street_name: Joi.string().required(),
  street_number: Joi.string().max(4),
  city: Joi.string().required(),
  zipcode: Joi.string().max(5),
});

module.exports = customerSchema;
