export interface CompanyDto {
  id: number;
  name: string;
  shortName: string;
  description: string;
  accessKey: string;
  secretKey: string;
  prefixTicket: string;
  dataSource: CompanyDefineDataSourceDto[];
}
export interface CompanyDefineDataSourceDto {
  id: number;
  source: string;
  isValidate: boolean;
  isSync: boolean;
  jsonData: string;
}
// generate a enum department,user,project,customer,scheme
export enum EnumDataSource {
  Department = 1,
  User = 2,
  Project = 3,
  Customer = 4,
  Scheme = 5,
}
