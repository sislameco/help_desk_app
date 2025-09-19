export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
