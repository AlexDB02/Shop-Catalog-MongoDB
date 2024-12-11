import { Request, Response } from "express";
import CategoryModel from "../models/category.model";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find(); 
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Categoría no encontrada" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching category", error: err });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, description, image } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: "Faltan campos por rellenar" });
  }

  try {
    const newCategory = new CategoryModel({ name, description, image });
    await newCategory.save();
    res.status(201).json(newCategory); 
  } catch (err) {
    res.status(500).json({ message: "Error al crear la categoría", error: err });
  }
};

// Update an existing category
export const updateCategory = async (req: Request, res: Response) => {


  const { name, description, image } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: "Faltan campos por rellenar" });
  }

  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    category.name = name;
    category.description = description;
    category.image = image;

    await category.save();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar la categoría", error: err });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
    const role = req.body.user?.role;
    if (role !== "admin") {
      return res.status(403).json({ message: "No tienes permiso para realizar esta acción" });
    }
  
    try {
      const category = await CategoryModel.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
  
      await CategoryModel.deleteOne({ _id: req.params.id });
      res.status(204).send(); 
    } catch (err) {
      res.status(500).json({ message: "Error al eliminar esta categoría", error: err });
    }
  };
  
