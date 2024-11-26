import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "my_secret_key"; // TODO: Define esto en un archivo .env

export const generateToken = (payload: object, expiresIn: string = "1h"): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error("Token inválido o expirado");
    }
};
