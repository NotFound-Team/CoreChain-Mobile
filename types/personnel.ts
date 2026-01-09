import { IPagination } from "./common";

export interface ISalaryAdvance {
  _id: string;
  employee: string;
  amount: number;
  reason: string;
  isApproved: boolean;
  approvedBy: {
    _id: string;
    email: string;
  };
  returnDate: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy: {
    _id: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    email: string;
  };
  deletedBy: {
    _id: string;
    email: string;
  };
}

export type TSalaryAdvanceCreate = {
  amount: number;
  reason: string;
  returnDate: string;
};

export type TQuerySalaryAdvance = Partial<
  Pick<ISalaryAdvance, "employee" | "isApproved" | "isDeleted">
> & {
  current?: number;
  pageSize?: number;
};

export interface IPersonnel {
  _id: string;
  employee: string;

  baseSalary?: number;
  workingHours?: number;
  kpiScore?: number;

  createdAt?: string;
  updatedAt?: string;
}

export type TQueryPersonnelSalary = Partial<IPersonnel> & IPagination;
