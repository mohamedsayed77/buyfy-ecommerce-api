/* eslint-disable node/no-unsupported-features/es-syntax */
class ApiFeatures {
  constructor(query, queryString, req) {
    this.query = query;
    this.queryString = queryString;
  }

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

  filter(req) {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryStringObj[field]);

    // Apply filtration by using [gte,gt,lte,lt)]
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
}
export default ApiFeatures;
