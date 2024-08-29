import { Request, Response, NextFunction } from "express";

export default async function(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // Generic server error
    return res.status(500).json({ error: "Internal Server Error" });
} 