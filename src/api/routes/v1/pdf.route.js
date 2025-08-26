const express = require('express');
const { pdfController } = require('../../controllers');

const router = express.Router();

router.post('/', pdfController.generatePdf);

module.exports = router;
