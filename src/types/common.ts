export type ApiResult<T> = {
  code: number;
  data: T;
  message: string;
};

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginationResult<T> = {
  list: T[];
  total: number;
};
