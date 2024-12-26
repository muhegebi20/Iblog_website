class ExpressError extends Error {
  constructor(StatusCode, message) {
    super();
    this.message = message;
    this.StatusCode = StatusCode;
  }
}

module.exports = ExpressError;
