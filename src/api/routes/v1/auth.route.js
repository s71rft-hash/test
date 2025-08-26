const express = require('express');
const validate = require('@/middlewares/validate.middleware');
const { authValidator } = require('@/validations');
const { authController } = require('@/api/controllers');
const RecaptchaV2 = require('@/middlewares/captcha.middleware');
const config = require('@/config/config');

const router = express.Router();

if (config.env !== 'test') {
  const recaptcha = new RecaptchaV2(config.recaptcha.siteKey, config.recaptcha.secretKey);
  router.post('/register', recaptcha.middleware.verify, validate(authValidator.register), authController.register);
  router.post('/login', recaptcha.middleware.verify, validate(authValidator.login), authController.login);
} else {
  router.post('/register', validate(authValidator.register), authController.register);
  router.post('/login', validate(authValidator.login), authController.login);
}
router.post('/logout', validate(authValidator.logout), authController.logout);

module.exports = router;
