const Joi = require('joi');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    parentId: Joi.number().integer(),
  }),
};

const getCategories = {
  query: Joi.object().keys({}),
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.number().integer(),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.number().integer(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      slug: Joi.string(),
      parentId: Joi.number().integer(),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.number().integer(),
  }),
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
