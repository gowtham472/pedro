export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const notFound = (what: string) => new ApiError(404, `${what} not found.`);
export const forbidden = (message = "You don't have access to this resource.") =>
  new ApiError(403, message);
export const badRequest = (message: string, details?: unknown) =>
  new ApiError(400, message, details);
