import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { generateToken } from "../utils/jwt";  
import bcrypt from "bcryptjs";  
import { AuthenticatedRequest } from "../middleware/auth.middleware";

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
    const role = req.body.user?.role;

    if (role !== "admin") {
        return res.status(403).json({ message: "No tienes permisos para acceder a esta información" });
    }

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
    const role = req.body.user?.role;

    if (role !== "admin") {
        return res.status(403).json({ message: "No tienes permisos para acceder a esta información" });
    }

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
