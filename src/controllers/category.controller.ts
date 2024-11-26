import { Request, Response } from "express";
import CategoryModel from "../models/category.model"; // Import Mongoose model for Category
import { AuthenticatedRequest } from "../middleware/auth.middleware"; // Import the middleware to check for authentication

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find(); // Fetch all categories from the database
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err });
  }
};

// Get a single category by ID
export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.findById(req.params.id); // Fetch category by ID
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching category", error: err });
  }
};

// Create a new category
export const createCategory = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.body.user?.role;
  if (role !== "admin") {
    return res.status(403).json({ message: "You do not have permission to perform this action" });
  }

  const { name, description, image } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newCategory = new CategoryModel({ name, description, image });
    await newCategory.save(); // Save the new category to the database
    res.status(201).json(newCategory); // Return the newly created category
  } catch (err) {
    res.status(500).json({ message: "Error creating category", error: err });
  }
};

// Update an existing category
export const updateCategory = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.body.user?.role;
  if (role !== "admin") {
    return res.status(403).json({ message: "You do not have permission to perform this action" });
  }

  const { name, description, image } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const category = await CategoryModel.findById(req.params.id); // Find category by ID
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category with new values
    category.name = name;
    category.description = description;
    category.image = image;

    await category.save(); // Save the updated category to the database
    res.status(200).json(category); // Return the updated category
  } catch (err) {
    res.status(500).json({ message: "Error updating category", error: err });
  }
};

// Delete a category
export const deleteCategory = async (req: AuthenticatedRequest, res: Response) => {
    const role = req.body.user?.role;
    if (role !== "admin") {
      return res.status(403).json({ message: "You do not have permission to perform this action" });
    }
  
    try {
      const category = await CategoryModel.findById(req.params.id); // Find category by ID
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      // Use deleteOne instead of remove
      await CategoryModel.deleteOne({ _id: req.params.id }); // Delete the category from the database
      res.status(204).send(); // Send a no content response after deletion
    } catch (err) {
      res.status(500).json({ message: "Error deleting category", error: err });
    }
  };
  
