// success response

class ApiResponse {
  constructor(statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = true;

    this.data = data ? data : null;
  }
}

export { ApiResponse };
