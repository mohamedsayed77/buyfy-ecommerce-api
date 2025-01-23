/**
 * Class representing API features for advanced filtering, sorting, pagination, and field limiting.
 */
class ApiFeatures {
  /**
   * Create an instance of ApiFeatures.
   * @param {Object} query - Mongoose query object.
   * @param {Object} queryString - Query string from the request.
   */
  constructor(query, queryString) {
    this.query = query; // The Mongoose query object
    this.queryString = queryString; // The request query string
  }

  /**
   * Paginates the query results based on the page and limit query parameters.
   * @param {number} countDocuments - Total number of documents in the database.
   * @returns {ApiFeatures} The current instance with pagination applied.
   */
  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1; // Default page is 1
    const limit = this.queryString.limit * 1 || 10; // Default limit is 10
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const endIndex = page * limit; // Calculate the end index for this page

    const pagination = {}; // Object to store pagination details

    // Add pagination details
    pagination.currentPage = page;
    pagination.pageSize = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    if (endIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }
    if (skip > 0) {
      pagination.prevPage = page - 1;
    }

    this.query = this.query.skip(skip).limit(limit); // Apply pagination to the query
    this.paginationResult = pagination; // Attach pagination results

    return this;
  }

  /**
   * Filters the query results based on the provided query parameters.
   * Removes reserved fields (e.g., page, sort, limit, fields) and processes advanced operators like gte, lte.
   * @param {Object} req - Express request object (optional).
   * @returns {ApiFeatures} The current instance with filtering applied.
   */
  filter(req) {
    const queryStringObj = { ...this.queryString }; // Clone the query string object
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"]; // Reserved fields to exclude
    excludesFields.forEach((field) => delete queryStringObj[field]); // Remove reserved fields

    // Process MongoDB comparison operators (e.g., gte, lte)
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let filterObject = JSON.parse(queryStr); // Convert back to a JavaScript object

    // Merge additional filters (e.g., from nested routes) if provided
    if (req && req.filterObject) {
      filterObject = { ...filterObject, ...req.filterObject };
    }

    this.query = this.query.find(filterObject); // Apply the filters to the query
    return this;
  }

  /**
   * Searches the query results based on a keyword provided in the query string.
   * Supports dynamic search logic for specific models like "products".
   * @param {string} modelName - Name of the model being queried (e.g., "products").
   * @returns {ApiFeatures} The current instance with search applied.
   */
  search(modelName) {
    if (this.queryString.keyword) {
      let searchQuery = {};
      if (modelName === "products") {
        searchQuery.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        searchQuery = {
          name: { $regex: this.queryString.keyword, $options: "i" },
        };
      }

      this.query = this.query.find(searchQuery); // Apply search filter
    }
    return this;
  }

  /**
   * Sorts the query results based on the sort query parameter.
   * Defaults to sorting by creation date in descending order.
   * @returns {ApiFeatures} The current instance with sorting applied.
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" "); // Convert comma-separated values to space-separated
      this.query = this.query.sort(sortBy); // Apply sorting
    } else {
      this.query = this.query.sort("-createdAt"); // Default sort by creation date in descending order
    }
    return this;
  }

  /**
   * Limits the fields returned in the query results based on the fields query parameter.
   * Defaults to excluding the "__v" field.
   * @returns {ApiFeatures} The current instance with field limiting applied.
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" "); // Convert comma-separated values to space-separated
      this.query = this.query.select(fields); // Apply field selection
    } else {
      this.query = this.query.select("-__v"); // Exclude the "__v" field by default
    }
    return this;
  }
}

export default ApiFeatures;
