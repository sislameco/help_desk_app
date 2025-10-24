export interface CommonSelectBox {
  value: string | number | boolean;
  label: string;
}

export interface CommonFilterParams
  extends Record<string, string | number | number[] | boolean | undefined> {
  page: number;
  pageSize: number;
}
