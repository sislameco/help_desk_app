export interface CompanyDto {
  id: number;
  name: string;
  shortName: string;
  description: string;
  accessKey: string;
  secretKey: string;
  prefixTicket: string;
  defineDataSources: CompanyDefineDataSourceDto[];
}
export interface CompanyDefineDataSourceDto {
  id: number;
  type: EnumDataSource;
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
export enum EnumDataType {
  textInput = 1,
  textArea = 2,
  number = 3,
  date = 4,
  dropdownList = 5,
  fileUpload = 6,
}
