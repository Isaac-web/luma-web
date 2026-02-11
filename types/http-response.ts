import { CheckIn, User } from './entities';

export type HttpResponse<T> = {
  data: T[];
  meta: {
    numberOfItems: number;
    numberOfPages: number;
    numberOfItemsPerPage: number;
    currentPage: number;
  };
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
};

export type FetchCheckinsResponse = HttpResponse<CheckIn>;
export type FetchUsersResponse = HttpResponse<User>;
