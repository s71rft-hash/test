const express = require('express');
const validate = require('@/middlewares/validate.middleware');
const { authValidator } = require('@/validations');
const { authController } = require('@/api/controllers');

const router = express.Router();

router.post('/register', validate(authValidator.register), authController.register);
router.post('/login', validate(authValidator.login), authController.login);
router.post('/logout', validate(authValidator.logout), authController.logout);

module.exports = router;
