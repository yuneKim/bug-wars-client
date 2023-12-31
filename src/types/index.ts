export type User = {
  username: string;
  roles: string[];
};

export type LoginDto = {
  username: string;
  password: string;
};

export type ParseDto = {
  code: string;
};
