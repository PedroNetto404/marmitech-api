export default class ApiError extends Error {
  public code: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.code = statusCode;
  }

  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  static unauthorized(message: string) {
    return new ApiError(401, message);
  }

  static forbidden(message: string) {
    return new ApiError(403, message);
  }

  static notFound(message: string) {
    return new ApiError(404, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }

  static internal(message: string) {
    return new ApiError(500, message);
  }

  static fromError(error: Error) {
    return new ApiError(500, error.message);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
