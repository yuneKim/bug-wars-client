export type User = {
  token: string;
  type: string;
  username: string;
  roles: string[];
};

export type LoginDto = {
  username: string;
  password: string;
};
