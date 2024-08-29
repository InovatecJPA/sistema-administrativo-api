export interface createUserDTO {
  cpf: string;
  name: string;
  email: string;
  profileName: string | null;
  password: string;
  phone: string;
  isAtivo?: boolean;
}

export interface userInfo {
  name?: string;
  id: string;
  email: string;
  isAdmin: boolean;
  profile_id: string;
  path?: string;
  routeFilter?: string;
}

export interface userLogin {
  email: string;
  password: string;
}

declare module "express-serve-static-core" {
  interface Request {
    userInfo: userInfo;
  }
}
