import {NextFunction, Request, Response} from "express";
import {verifyToken} from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
    user?: {id: string, role: string};
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({message: "Token no proporcionado"});
        return;
    }

    try {
        req.body.user = verifyToken(token) as {id: string, role: string};
        console.log(req.body.user);
        next();
    } catch (error) {
        res.status(401).json({message: "Token inválido o expirado"});
    }
};
