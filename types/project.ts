export interface IProject {
  _id: string;
  name: string;
  description: string;
  attachments: string[];
  department: string;
  manager:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  teamMembers:
    | string[]
    | {
        _id: string;
        name: string;
        email: string;
      }[]
    | string;
  tasks: string[];
  expenses: {
    cost: number;
    reason: string;
  }[];
  revenue: number;
  priority: number;
  status: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  actualEndDate: Date;
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

export interface ProjectQueryParams extends Partial<IProject> {
  current?: number | string;
  pageSize?: number | string;
}
