export type SampleUserType = {
  id: number;
  name: string;
  email: string;
  age: number;
};

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
