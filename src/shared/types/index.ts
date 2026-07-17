export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
