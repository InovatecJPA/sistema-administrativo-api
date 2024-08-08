import { Request, Response, NextFunction } from "express";

export default async function setCORS(req: Request, res: Response, next: NextFunction): Promise<void> {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");

	// If it's an OPTIONS request, respond immediately
	if (req.method === 'OPTIONS') {
		res.sendStatus(204); // No Content
	} else {
		next();
	}
};
