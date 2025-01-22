// Middleware to set the category ID in the request body if not provided
const setCategoryId = (req, res, next) => {
  if (!req.body.category && req.params.categoryId) {
    req.body.category = req.params.categoryId;
  }
  next();
};

const setProductId = (req, res, next) => {
  if (!req.body.product && req.params.productId) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user._id; // Set the user ID in the request body if not provided and user is authenticated.
  }
  next();
};

// Middleware to filter by category if category ID is provided in URL params
const filterByCategory = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  // Attach filter object to the request
  req.filterObject = filterObject;
  next();
};

const filterByProduct = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  // Attach filter object to the request
  req.filterObject = filterObject;
  next();
};

export default {
  setCategoryId,
  filterByCategory,
  filterByProduct,
  setProductId,
};
