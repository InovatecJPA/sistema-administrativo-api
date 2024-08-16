import Profile from "../model/Profile";
import User from "../model/User";

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import CpfValidator from "../utils/cpfValidator";
import moment from "moment";

// const sendMailPromise = require('../../Emails/mailer/mailer');
// const helper = require('../../Emails/controllers/candidatoHelper');
//

class UserController {
  async store(req: Request, res: Response): Promise<Response> {
    return res.send("OIE");
  }
}

export default new UserController();
