const Joi = require('joi');

const terminateSession = {
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  terminateSession,
};
