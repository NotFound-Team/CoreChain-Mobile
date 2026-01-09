export interface IUserRef {
  _id: string;
  email: string;
}

export interface IPagination {
  current?: number;
  pageSize?: number;
}
