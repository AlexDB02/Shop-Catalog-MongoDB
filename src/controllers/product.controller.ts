import { Request, Response } from "express";
import ProductModel from "../models/product.model"; // Mongoose model for Product
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import StoreModel from "../models/store.model"; // Mongoose model for Store

// Get all products or filter by store
export const getProducts = async (req: Request, res: Response) => {
  const { store } = req.query as { store: string };
  
  try {
    if (store) {
      // Filter products by store_id
      const filteredProducts = await ProductModel.find({ store_id: store });
      res.status(200).json(filteredProducts);
      return;
    }

    // Get all products
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
};

// Get a single product by ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err });
  }
};

// Create a new product
export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.body.user?.role;
  if (role !== "admin") {
    return res.status(403).json({ message: "You do not have permission to perform this action" });
  }

  const body = validateBody(req, res);
  if (!body) return;

  const { name, description, price, image, store_id } = body;

  try {
    // Check if the store exists
    const storeExists = await StoreModel.findById(store_id);
    if (!storeExists) {
      return res.status(400).json({ message: "Store does not exist" });
    }

    // Create a new product
    const newProduct = new ProductModel({
      name,
      description,
      price,
      image,
      store_id,
    });

    await newProduct.save(); // Save the product to the database
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err });
  }
};

// Update an existing product
export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.body.user?.role;
  if (role !== "admin") {
    return res.status(403).json({ message: "You do not have permission to perform this action" });
  }

  const body = validateBody(req, res);
  if (!body) return;

  const { name, description, price, image, store_id } = body;

  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.image = image;
    product.store_id = store_id;

    await product.save(); // Save the updated product to the database
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err });
  }
};

// Delete a product by ID
export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.body.user?.role;
  if (role !== "admin") {
    return res.status(403).json({ message: "You do not have permission to perform this action" });
  }

  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product
    await ProductModel.deleteOne({ _id: req.params.id });
    res.status(204).send(); // No content, successfully deleted
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
};

// Helper function to validate the request body for creating/updating a product
function validateBody(req: AuthenticatedRequest, res: Response) {
  const { name, description, price, store_id } = req.body;
  if (!name || !description || !price || !store_id) {
    res.status(400).json({ message: "Missing required fields" });
    return null;
  }

  return req.body;
}
