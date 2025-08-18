const express = require('express');
const auth = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { sessionValidator } = require('../../validators');
const { sessionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth('manageUsers'), sessionController.getActiveSessions);

router
  .route('/:token')
  .delete(auth('manageUsers'), validate(sessionValidator.terminateSession), sessionController.terminateSession);

module.exports = router;
