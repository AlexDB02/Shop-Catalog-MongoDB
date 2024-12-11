import { Request, Response } from "express";
import StoreModel from "../models/store.model";

export const getStores = async (req: Request, res: Response) => {
    const { categories } = req.query as { categories: string[] };
    
    try {
        let stores;
        if (categories) {
            stores = await StoreModel.find({ category_id: { $in: categories } });
        } else {
            stores = await StoreModel.find();
        }
        res.status(200).json(stores);
    } catch (err) {
        res.status(500).json({ message: "Error fetching stores", error: err });
    }
};

export const getStore = async (req: Request, res: Response) => {
    try {
        const store = await StoreModel.findById(req.params.id);
        if (store) {
            res.status(200).json(store);
        } else {
            res.status(404).json({ message: "Tienda no encontrada" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching store", error: err });
    }
};

export const createStore = async (req: Request, res: Response) => {
    const body = validateBody(req, res);
    if (!body) return;

    const { name, description, image, category_id, main_address, main_phone, website } = body;

    try {
        const newStore = new StoreModel({
            name,
            description,
            image,
            category_id,
            main_address,
            main_phone,
            website,
        });
        await newStore.save();
        res.status(201).json(newStore);
    } catch (err) {
        res.status(500).json({ message: "Error creating store", error: err });
    }
};

export const updateStore = async (req: Request, res: Response) => {
    const storeId = req.params.id;
    const body = validateBody(req, res);
    if (!body) return;

    try {
        const store = await StoreModel.findById(storeId);
        if (store) {
            const { name, description, image, category_id, main_address, main_phone, website } = body;
            store.set({ name, description, image, category_id, main_address, main_phone, website });
            await store.save();
            res.status(200).json(store);
        } else {
            res.status(404).json({ message: "Tienda no encontrada" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating store", error: err });
    }
};

export const deleteStore = async (req: Request, res: Response) => {
    try {
        const store = await StoreModel.findByIdAndDelete(req.params.id);
        if (store) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: "Tienda no encontrada" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting store", error: err });
    }
};

const validateBody = (req: Request, res: Response) => {
    const { name, description, category_id, main_address, main_phone } = req.body;
    if (!name || !description || !category_id || !main_address || !main_phone) {
        res.status(400).json({ message: "Faltan campos requeridos" });
        return null;
    }
    return req.body;
};
