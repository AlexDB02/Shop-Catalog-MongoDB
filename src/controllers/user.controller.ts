import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { generateToken } from "../utils/jwt";  
import bcrypt from "bcryptjs";  
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { EmailService } from "../domain/services/email.service";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Faltan campos por rellenar" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = generateToken({ id: user.id, role: user.role });
        return res.status(200).json({ token });
    } catch (err) {
        return res.status(500).json({ message: "Error al iniciar sesión", error: err });
    }
};

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {


    try {
        const users = await UserModel.find();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching users", error: err });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, role, image } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Faltan campos por rellenar" });
    }

    try {

        const emailExists = await UserModel.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "El email ya está en uso" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            image,
        });

        await newUser.save();

        const emailService = new EmailService();
        await emailService.sendEmail({
            to: newUser.email,
            subject: `¡Gracias por unirte a Barbi Fashionistas!`,
            htmlBody: `
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>¡Gracias por unirte!</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #4CAF50;
                        font-size: 24px;
                        margin-bottom: 10px;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.5;
                        margin: 10px 0;
                    }
                    .btn {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: #fff;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                        margin-top: 20px;
                    }
                    .footer {
                        font-size: 12px;
                        color: #999;
                        text-align: center;
                        margin-top: 30px;
                    }
                </style>
            </head>
            <body>

                <div class="email-container">
                    <h1>¡Gracias por unirte a Barbi Fashionistas!</h1>
                    <p>Hola ${newUser.name},</p>
                    <p>¡Bienvenido/a a nuestra comunidad! Nos alegra tenerte con nosotros. Ahora puedes empezar a disfrutar de todas las funcionalidades que Barbi Fashionistas tiene para ofrecerte.</p>
                    <p>Si tienes alguna pregunta o necesitas ayuda para empezar, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
                    <p class="footer">Este es un correo automatizado. Por favor no respondas a este mensaje. Si necesitas ayuda, contacta con nuestro equipo de soporte.</p>
                </div>

            </body>
            </html>
            `
        });
        return res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            image: newUser.image,
        });

    } catch (err) {
        return res.status(500).json({ message: "Error creating user", error: err });
    }
};


export const getUser = async (req: AuthenticatedRequest, res: Response) => {


    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
        });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching user", error: err });
    }
};

export const getMyUser = async (req: AuthenticatedRequest, res: Response) => {
    const userID = req.user?.id;

    if (!userID) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    try {
        const user = await UserModel.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
        });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching user", error: err });
    }
};

export const updateMyUser = async (req: AuthenticatedRequest, res: Response) => {
    const userID = req.user?.id;

    if (!userID) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    try {
        const { name, email, password, role, image } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Faltan campos por rellenar" });
        }

        const user = await UserModel.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

        user.set({ name, email, password: hashedPassword, role, image });
        await user.save();

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ message: "Error al actualizar al usuario", error: err });
    }
};

export const deleteMyUser = async (req: AuthenticatedRequest, res: Response) => {
    const userID = req.user?.id;

    if (!userID) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    try {
        const user = await UserModel.findByIdAndDelete(userID);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: "Error al eliminar al usuario", error: err });
    }
};
