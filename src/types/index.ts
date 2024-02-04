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

export type ParseDto = {
  code: string;
};

export type ScriptDto = {
  name: string;
  raw: string;
};

export type Script = {
  id: number;
  name: string;
  raw: string;
  bytecode: string;
  bytecodeValid: boolean;
};

export type ScriptName = {
  id: number;
  name: string;
  author: string;
};

export type PlayGameDto = {
  scriptIds: number[];
  mapId: number;
};
