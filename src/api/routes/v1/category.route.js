const express = require('express');
const auth = require('@/middlewares/auth.middleware');
const validate = require('@/middlewares/validate.middleware');
const { categoryValidator } = require('@/api/validators');
const { categoryController } = require('@/api/controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(categoryValidator.createCategory), categoryController.createCategory)
  .get(auth(), validate(categoryValidator.getCategories), categoryController.getCategories);

router
  .route('/:categoryId')
  .get(auth(), validate(categoryValidator.getCategory), categoryController.getCategory)
  .patch(auth(), validate(categoryValidator.updateCategory), categoryController.updateCategory)
  .delete(auth(), validate(categoryValidator.deleteCategory), categoryController.deleteCategory);

module.exports = router;
