export interface Pagination {
  per_page: number;
  cursor: {
    next: any | null;
    self: number;
  };
  total: number;
  count: number;
}

export interface Paginated<T> {
  page: number;
  perPage: number;
  total: number;
  results: Array<T>;
}

export interface PaginatedResults<T> {
  total: number;
  pages: number;
  next: string;
  prev: string;
  results: Array<T>;
}

export interface PaginatedRequest {
  page?: number;
  pageSize?: number;
  setMeta?: (props: number | ((oldValues: any) => any)) => void; // TODO
}
