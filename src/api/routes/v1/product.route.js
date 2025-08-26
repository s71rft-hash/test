const express = require('express');
const auth = require('@/middlewares/auth.middleware');
const validate = require('@/middlewares/validate.middleware');
const { productValidator } = require('@/validations');
const { productController } = require('@/api/controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(productValidator.createProduct), productController.createProduct)
  .get(auth(), validate(productValidator.getProducts), productController.getProducts);

router
  .route('/:productId')
  .get(auth(), validate(productValidator.getProduct), productController.getProduct)
  .patch(auth(), validate(productValidator.updateProduct), productController.updateProduct)
  .delete(auth(), validate(productValidator.deleteProduct), productController.deleteProduct);

module.exports = router;
