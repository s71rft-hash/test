const { Product } = require('@/models');
const { Op } = require('sequelize');
const httpStatus = require('http-status');
const ApiError = require('@/utils/ApiError');

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return product;
};

/**
 * Query for products
 * @param {Object} filter - Sequelize filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getProducts = async (filter, options) => {
  const { limit, page } = options;
  const offset = (page - 1) * limit;

  const where = {};
  if (filter.name) {
    where.name = { [Op.like]: `%${filter.name}%` };
  }

  if (filter.categoryIds) {
    where.categoryId = { [Op.in]: filter.categoryIds };
  }

  const order = [];
  if (options.sortBy) {
    const [field, direction] = options.sortBy.split(':');
    order.push([field, direction.toUpperCase()]);
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    limit,
    offset,
    order,
  });

  return {
    totalResults: count,
    results: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    limit,
  };
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findByPk(id);
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.destroy();
  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
