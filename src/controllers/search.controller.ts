import { Request, Response } from "express";
import StoreModel from "../models/store.model";
import BranchModel from "../models/branch.model";
import ProductModel from "../models/product.model"; 

enum SearchType {
    STORE = "stores",
    BRANCH = "branches",
    PRODUCT = "products"
}

export const searchAll = async (req: Request, res: Response) => {
    const { type, query } = req.query as { type: SearchType, query: string };

    if (!type) {
        return res.status(400).json({ message: "Falta el tipo de búsqueda" });
    }

    try {
        switch (type) {
            case SearchType.STORE:
                const stores = await searchItems(query, StoreModel);
                res.status(200).json(stores);
                break;
            case SearchType.BRANCH:
                const branches = await searchItems(query, BranchModel);
                res.status(200).json(branches);
                break;
            case SearchType.PRODUCT:
                const products = await searchItems(query, ProductModel);
                res.status(200).json(products);
                break;
            default:
                res.status(400).json({ message: "Tipo de búsqueda no válido" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error during search", error: err });
    }
};

export const itemDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { type } = req.query as { type: SearchType };

    if (!type || !id) {
        return res.status(400).json({ message: "Falta el tipo o el ID del elemento" });
    }

    try {
        let item;
        switch (type) {
            case SearchType.STORE:
                item = await searchItem(id, StoreModel);
                break;
            case SearchType.BRANCH:
                item = await searchItem(id, BranchModel);
                break;
            case SearchType.PRODUCT:
                item = await searchItem(id, ProductModel);
                break;
            default:
                return res.status(400).json({ message: "Tipo de elemento no válido" });
        }

        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ message: "Elemento no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching item", error: err });
    }
};

const searchItems = async (query: string, model: any) => {
    return model.find({
        name: { $regex: query, $options: "i" }
    });
};

const searchItem = async (id: string, model: any) => {
    return model.findById(id);
};
