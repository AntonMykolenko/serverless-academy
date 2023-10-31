import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: string; 
        }
    }
}

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!process.env.JWT_SECRET) {
        return res.status(500).send({ error: "JWT_SECRET is not defined" });
    }

    if (!token) {
        return res.status(401).send({ error: "Access denied" });
    }

    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET) as { email: string };
        req.user = verifiedToken.email; 
        next();
    } catch (err: any) {
        return res.status(401).send({ error: err.message });
    }
};
