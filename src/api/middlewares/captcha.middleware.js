const { RecaptchaV2 } = require('express-recaptcha');
const config = require('../../config/config');
const { recaptcha } = new RecaptchaV2(config.recaptcha.siteKey, config.recaptcha.secretKey);

module.exports = { recaptcha };
