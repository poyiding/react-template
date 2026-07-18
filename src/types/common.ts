export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginationResult<T> = {
  list: T[];
  total: number;
};

export type ApiResponse<T> = {
  data: T;
};
