import {Request, Response} from "express";
import ProductModel from "../models/product.model";
import StoreModel from "../models/store.model";

export const getProducts = async (req: Request, res: Response) => {
    const {store} = req.query as { store: string };

    try {
        if (store) {
            const filteredProducts = await ProductModel.find({store_id: store});
            res.status(200).json(filteredProducts);
            return;
        }

        const products = await ProductModel.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({message: "Error fetching products", error: err});
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({message: "Producto no encontrado"});
        }
    } catch (err) {
        res.status(500).json({message: "Error fetching product", error: err});
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const body = validateBody(req, res);
    if (!body) return;

    const {name, description, price, image, store_id} = body;

    try {
        const storeExists = await StoreModel.findById(store_id);
        if (!storeExists) {
            return res.status(400).json({message: "Esta tienda no existe"});
        }

        const newProduct = new ProductModel({
            name,
            description,
            price,
            image,
            store_id
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({message: "Error al crear el producto", error: err});
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const body = validateBody(req, res);
    if (!body) return;

    const {name, description, price, image, store_id} = body;

    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({message: "Producto no encontrado"});
        }

        product.name = name;
        product.description = description;
        product.price = price;
        product.image = image;
        product.store_id = store_id;

        await product.save();
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({message: "Error al actualizar el producto", error: err});
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({message: "Producto no encontrado"});
        }

        await ProductModel.deleteOne({_id: req.params.id});
        res.status(204).send();
    } catch (err) {
        res.status(500).json({message: "Error al eliminar el producto", error: err});
    }
};

function validateBody(req: Request, res: Response) {
    const {name, description, price, store_id} = req.body;
    if (!name || !description || !price || !store_id) {
        res.status(400).json({message: "Faltan campos por rellenar"});
        return null;
    }

    return req.body;
}
