// É usado para tipar o objeto userInfo que é injetado no request do express

export interface userInfo {
  name?: string;
  id: string;
  email: string;
  isAdmin: boolean;
  profile_id: string;
  path?: string;
  routeFilter?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    userInfo: userInfo;
  }
}
