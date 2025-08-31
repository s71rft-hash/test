const httpStatus = require('http-status');
const catchAsync = require('@/utils/catchAsync');

const renderIndex = catchAsync(async (req, res) => {
  res.render('index');
});

module.exports = {
  renderIndex,
};
