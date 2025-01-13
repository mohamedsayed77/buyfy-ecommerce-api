class ApiFeatures {
  constructor(query, queryString) {
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
}
export default ApiFeatures;
