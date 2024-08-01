import { Request, Response, NextFunction } from "express";

const validateResponser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");

	return next();
};

export default validateResponser;
