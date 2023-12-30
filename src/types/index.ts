export type User = {
  username: string;
  roles: string[];
};

export type LoginDto = {
  username: string;
  password: string;
};

export type RegisterDto = {
  username: string;
  password: string;
  email: string;
};
