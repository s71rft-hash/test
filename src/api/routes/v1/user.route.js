const express = require('express');
const auth = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { userValidator } = require('../../validators');
const { userController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidator.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidator.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth(), validate(userValidator.getUser), userController.getUser)
  .patch(auth(), validate(userValidator.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidator.deleteUser), userController.deleteUser);

module.exports = router;
