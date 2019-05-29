const Joi = require('joi');

exports.validateUser = (user) => {
    const schema = {
      username: Joi.string().min(1).required(),
      password: Joi.string().min(5).required()
    }
    return Joi.validate(user, schema);
};