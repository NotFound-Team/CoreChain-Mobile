export interface IPosition {
  _id: string;
  title: string;
  description: string;
  parentId: string;
  level: number;
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


export interface PositionQueryParams extends Partial<IPosition> {
  current?: number | string;
  pageSize?: number | string;
}