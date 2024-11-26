import { Request, Response } from "express";
import Branch from "../models/branch.model"; // Assuming you have a Mongoose model for Branch
import Store from "../models/store.model"; // Assuming you have a Mongoose model for Store
import { AuthenticatedRequest } from "../middleware/auth.middleware";

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

export const createBranch = async (req: AuthenticatedRequest, res: Response) => {
    const role = req.body.user?.role;
    if (role !== "admin") {
        return res.status(403).json({ message: "You do not have permission to perform this action" });
    }
    
    const body = validateBody(req, res);
    if (!body) return;

    const { name, address, store_id, latitude, longitude, services, schedule } = body;

    try {
        // Check if the store exists
        const storeExists = await Store.exists({ _id: store_id });
        if (!storeExists) {
            return res.status(400).json({ message: "Store does not exist" });
        }

        const newBranch = new Branch({
            name,
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

export const updateBranch = async (req: AuthenticatedRequest, res: Response) => {
    const role = req.body.user?.role;
    if (role !== "admin") {
        return res.status(403).json({ message: "You do not have permission to perform this action" });
    }

    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        const body = validateBody(req, res);
        if (!body) return;

        const { name, address, store_id, latitude, longitude, services, schedule } = body;

        // Update the branch document
        branch.name = name;
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

export const deleteBranch = async (req: AuthenticatedRequest, res: Response) => {
    const role = req.body.user?.role;
    if (role !== "admin") {
        return res.status(403).json({ message: "You do not have permission to perform this action" });
    }

    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        // Use deleteOne instead of remove
        await Branch.deleteOne({ _id: req.params.id });
        res.status(204).send();
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: "Error deleting branch", error: errorMessage});
    }
};


function validateBody(req: Request, res: Response) {
    const { name, address, store_id, latitude, longitude, services, schedule } = req.body;

    if (!name || !address || !store_id || !latitude || !longitude) {
        res.status(400).json({ message: "Missing required fields" });
        return null;
    }

    return { name, address, store_id, latitude, longitude, services, schedule };
}
