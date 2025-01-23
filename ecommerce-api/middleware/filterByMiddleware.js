/**
 * Middleware to set the category ID in the request body if not provided.
 * Useful for endpoints where `categoryId` is passed as a route parameter.
 */
const setCategoryId = (req, res, next) => {
  if (!req.body.category && req.params.categoryId) {
    req.body.category = req.params.categoryId;
  }
  next();
};

/**
 * Middleware to set the product ID and user ID in the request body if not provided.
 * Ensures proper associations for endpoints where `productId` is passed as a route parameter.
 */
const setProductId = (req, res, next) => {
  // Set product ID from route parameters if not provided in the request body
  if (!req.body.product && req.params.productId) {
    req.body.product = req.params.productId;
  }

  // Set user ID from authenticated user if not provided in the request body
  if (!req.body.user) {
    req.body.user = req.user._id;
  }

  next();
};

/**
 * Middleware to filter requests by category if `categoryId` is provided in the route parameters.
 * Attaches the filter object to the request for use in query building.
 */
const filterByCategory = (req, res, next) => {
  let filterObject = {};

  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }

  req.filterObject = filterObject; // Attach filter object to the request
  next();
};

/**
 * Middleware to filter requests by product if `productId` is provided in the route parameters.
 * Attaches the filter object to the request for use in query building.
 */
const filterByProduct = (req, res, next) => {
  let filterObject = {};

  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }

  req.filterObject = filterObject; // Attach filter object to the request
  next();
};

export default {
  setCategoryId,
  setProductId,
  filterByCategory,
  filterByProduct,
};
