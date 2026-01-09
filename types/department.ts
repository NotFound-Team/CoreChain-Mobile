export interface IDepartment {
  _id: string;
  name: string;
  code: string;
  description: string;
  manager: string;
  employees: string[] | string;
  status: string;
  budget: number;
  projectIds: string[];
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

export interface DepartmentQueryParams extends Partial<IDepartment> {
  current?: number | string;
  pageSize?: number | string;
}
