export interface createUser {
  cpf: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  profileName?: string;
  isActive?: boolean;
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

export class userRO {
  public user: {
    name: string;
    email: string;
  };
  public token: string;

  constructor(user: { name: string; email: string }, token: string) {
    this.user = user;
    this.token = token;
  }
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
