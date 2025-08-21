const express = require('express');
const auth = require('@/middlewares/auth.middleware');
const validate = require('@/middlewares/validate.middleware');
const { sessionValidator } = require('@/validations');
const { sessionController } = require('@/api/controllers');

const router = express.Router();

router
  .route('/')
  .get(auth('manageUsers'), sessionController.getActiveSessions);

router
  .route('/:token')
  .delete(auth('manageUsers'), validate(sessionValidator.terminateSession), sessionController.terminateSession);

module.exports = router;
