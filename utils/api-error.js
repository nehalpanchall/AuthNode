class ApiError extends Error {
  constructor(statusCode, message = 'Api Error', errors = [], stack = '') {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    }
  }
}

export { ApiError };
