const httpStatus = require('http-status');
const { pdfService } = require('../../services');
const catchAsync = require('../../utils/catchAsync');

const generatePdf = catchAsync(async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'URL is required' });
  }

  const pdf = await pdfService.generatePdf(url);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
  res.send(pdf);
});

module.exports = {
  generatePdf,
};
