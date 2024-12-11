import { Request, Response } from "express";
import Branch from "../models/branch.model";
import Store from "../models/store.model";

export const getBranches = async (req: Request, res: Response) => {
    const { store } = req.query as { store: string };
    
    try {
        if (store) {
            const filteredBranches = await Branch.find({ store_id: store });
            return res.status(200).json(filteredBranches);
        }
        
        const branches = await Branch.find();
        res.status(200).json(branches);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: "Error retrieving branches", error: errorMessage });
    }
};

export const getBranch = async (req: Request, res: Response) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (branch) {
            res.status(200).json(branch);
        } else {
            res.status(404).json({ message: "Branch not found" });
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: "Error retrieving branch", error: errorMessage });
    }
};

export const createBranch = async (req: Request, res: Response) => {
    const body = validateBody(req, res);
    if (!body) return;

    const { name, category_id, address, store_id, latitude, longitude, services, schedule } = body;

    try {
        // Check if the store exists
        const storeExists = await Store.exists({ _id: store_id });
        if (!storeExists) {
            return res.status(400).json({ message: "Store does not exist" });
        }

        const newBranch = new Branch({
            name,
            category_id,
            address,
            store_id,
            latitude,
            longitude,
            services,
            schedule,
        });

        await newBranch.save();
        res.status(201).json(newBranch);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: "Error creating branch", error: errorMessage });
    }
};

export const updateBranch = async (req: Request, res: Response) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        const body = validateBody(req, res);
        if (!body) return;

        const { name, category_id, address, store_id, latitude, longitude, services, schedule } = body;

        // Update the branch document
        branch.name = name;
        branch.category_id = category_id;
        branch.address = address;
        branch.store_id = store_id;
        branch.latitude = latitude;
        branch.longitude = longitude;
        branch.services = services;
        branch.schedule = schedule;

        await branch.save();
        res.status(200).json(branch);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: "Error updating branch", error: errorMessage });
    }
};

export const deleteBranch = async (req: Request, res: Response) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        await Branch.deleteOne({ _id: req.params.id });
        res.status(204).send();
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: "Error deleting branch", error: errorMessage});
    }
};

function validateBody(req: Request, res: Response) {
    const { name, category_id, address, store_id, latitude, longitude, services, schedule } = req.body;

    if (!name || !category_id || !address || !store_id || !latitude || !longitude) {
        res.status(400).json({ message: "Missing required fields" });
        return null;
    }

    return { name, address, category_id, store_id, latitude, longitude, services, schedule };
}
