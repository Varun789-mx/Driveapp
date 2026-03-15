import { verify } from "jsonwebtoken";
import type { NextFunction, Request as ExpressReq, Response as ExpressRes } from "express";

export const requireAuth = async (req: ExpressReq, res: ExpressRes, next: NextFunction) => {
    const secret = process.env.NEXT_AUTH_SECRET!;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token found" })
    }
    try {
        const JwtPayload = verify(token, secret);
        req.userId = JwtPayload;
        next();
    } catch (error) {
        return res.status(500).json({
            error: "Token verification failed",
        })
    }
}