const express = require('express');
const viewController = require('@/api/controllers/view.controller');

const router = express.Router();

router.get('/', viewController.renderIndex);

module.exports = router;
