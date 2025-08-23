const express = require('express');
const validate = require('@/middlewares/validate.middleware');
const { authValidator } = require('@/validations');
const { authController } = require('@/api/controllers');
const { recaptcha } = require('@/middlewares/captcha.middleware');

const router = express.Router();

router.post('/register', recaptcha.middleware.verify, validate(authValidator.register), authController.register);
router.post('/login', recaptcha.middleware.verify, validate(authValidator.login), authController.login);
router.post('/logout', validate(authValidator.logout), authController.logout);

module.exports = router;
