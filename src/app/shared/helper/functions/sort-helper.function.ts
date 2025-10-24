import { EnumSortBy } from '@shared/enums/sort-by.enum';

type SortableParams = {
  sortColumn?: string;
  sortBy?: EnumSortBy;
  [key: string]: unknown; // allow extra params (page, pageSize, filters, etc.)
};

/**
 * Convert sortColumn + sortBy params into API sort convention (col:asc/desc).
 */
export function withSortParam<T extends SortableParams>(
  params: T,
): Omit<T, 'sortColumn' | 'sortBy'> & { sort?: string } {
  const { sortColumn, sortBy, ...rest } = params;

  if (sortColumn && sortBy) {
    const sortDirection = sortBy === EnumSortBy.ASC ? 'asc' : 'desc';
    return {
      ...rest,
      sort: `${sortColumn}:${sortDirection}`,
    };
  }

  return rest;
}
