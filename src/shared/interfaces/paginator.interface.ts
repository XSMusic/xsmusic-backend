export interface PaginatorI {
  pageSize: number;
  currentPage: number;
  totalPages: number;
  total?: number;
}
