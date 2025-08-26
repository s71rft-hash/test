const { Category, Product } = require('@/models');
const { Op } = require('sequelize');
const httpStatus = require('http-status');
const ApiError = require('@/utils/ApiError');

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  const category = await Category.create(categoryBody);
  return category;
};

/**
 * Query for categories
 * @returns {Promise<QueryResult>}
 */
const getCategories = async () => {
  const categoriesWithCounts = await Category.findAll({
    attributes: [
      'id',
      'name',
      'slug',
      'parentId',
      'createdAt',
      'updatedAt',
      [
        Category.sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Products"
          WHERE "Products"."categoryId" = "Category"."id"
        )`),
        'productCount',
      ],
    ],
    group: ['Category.id'],
    raw: true,
  });

  categoriesWithCounts.forEach((c) => {
    c.productCount = parseInt(c.productCount, 10);
  });

  const categoryMap = new Map();
  categoriesWithCounts.forEach((c) => {
    c.children = [];
    categoryMap.set(c.id, c);
  });

  const rootCategories = [];
  categoriesWithCounts.forEach((c) => {
    if (c.parentId) {
      const parent = categoryMap.get(c.parentId);
      if (parent) {
        parent.children.push(c);
      }
    } else {
      rootCategories.push(c);
    }
  });

  const sumCounts = (category) => {
    for (const child of category.children) {
      sumCounts(child);
      category.productCount += child.productCount;
    }
  };

  rootCategories.forEach(sumCounts);

  return rootCategories;
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  const descendantIds = await getDescendantCategoryIds(id);
  const productCount = await getProductsCount(descendantIds);
  const categoryJson = category.toJSON();
  categoryJson.productCount = productCount;
  return categoryJson;
};

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.destroy();
  return category;
};


const getProductsCount = async (categoryIds) => {
  if (!categoryIds || categoryIds.length === 0) {
    return 0;
  }
  return Product.count({
    where: {
      categoryId: {
        [Op.in]: categoryIds,
      },
    },
  });
};

const getDescendantCategoryIds = async (categoryId) => {
  const category = await Category.findByPk(categoryId, {
    include: [{ model: Category, as: 'children', attributes: ['id'] }],
  });
  if (!category) {
    return [];
  }
  let ids = [category.id];
  if (category.children && category.children.length > 0) {
    for (const child of category.children) {
      const childIds = await getDescendantCategoryIds(child.id);
      ids = [...ids, ...childIds];
    }
  }
  return ids;
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getDescendantCategoryIds,
};
