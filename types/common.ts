export interface IUserRef {
  _id: string;
  email: string;
}

export interface IPagination {
  current?: number;
  pageSize?: number;
}

export type SortOrder = 1 | -1 | "asc" | "desc";

export type DateFilter = {
  gte?: string; // ISO date
  lte?: string;
};
