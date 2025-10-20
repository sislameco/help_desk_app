export interface RootCauseInputDto {
  id?: number;
  name: string;
  description?: string;
  displayOrder?: number;
  fkCompanyId: number;
  type: EnumRootResolutionType;
  task: number; // e.g., EnumCrud.Create (1)
}

export interface RootCauseOutDto {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  fkCompanyId: number;
  type: EnumRootResolutionType;
}
export enum EnumRootResolutionType {
  RootCause = 1,
  Resolution = 2,
}
