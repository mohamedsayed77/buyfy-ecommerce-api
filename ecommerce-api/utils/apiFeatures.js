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
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Paginates the query results.
   * @param {number} countDocuments - Total number of documents.
   * @returns {ApiFeatures} The current instance.
   */
  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};

    pagination.currentPage = page;
    pagination.pageSize = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    if (endIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }
    if (skip > 0) {
      pagination.prevPage = page - 1;
    }

    this.query = this.query.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }

  /**
   * Filters the query based on the request query string.
   * @param {Object} req - Express request object.
   * @returns {ApiFeatures} The current instance.
   */
  filter(req) {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryStringObj[field]);

    // Apply filtration by using [gte,gt,lte,lt]
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let filterObject = JSON.parse(queryStr);

    // Only merge req.filterObject if it exists
    if (req && req.filterObject) {
      filterObject = { ...filterObject, ...req.filterObject };
    }

    this.query = this.query.find(filterObject);
    return this;
  }

  /**
   * Searches the query based on the keyword in the query string.
   * @param {string} modelName - Name of the model being queried.
   * @returns {ApiFeatures} The current instance.
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

      this.query = this.query.find(searchQuery);
    }
    return this;
  }

  /**
   * Sorts the query results based on the sort query parameter.
   * @returns {ApiFeatures} The current instance.
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  /**
   * Limits the fields in the query results based on the fields query parameter.
   * @returns {ApiFeatures} The current instance.
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
}

export default ApiFeatures;
