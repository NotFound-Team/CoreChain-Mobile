import { SortOrder } from "./common";

export interface TypeTask {
  _id: string;
  title: string;
  description: string;
  attachments: string[];
  createdBy: {
    _id: string;
    email: string;
  };
  assignedTo: string;
  projectId: string;
  priority: number;
  status: number;
  startDate: Date | string;
  dueDate: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  updatedBy: {
    _id: string;
    email: string;
  };
  deletedBy: {
    _id: string;
    email: string;
  };
}

export interface TaskQueryParams extends Partial<TypeTask> {
  current?: number | string;
  pageSize?: number | string;
  sort?: string | Record<string, SortOrder>;

  // populate
  populate?: string | string[];
  // projection
  fields?: string;
}
