import {Router} from "express";
import * as categoryController from "../controllers/category.controller";
import {asyncHandler} from "../utils/asyncHandler";

const categoryRouter = Router();

categoryRouter.get("/", asyncHandler(categoryController.getCategories));
categoryRouter.get("/:id", asyncHandler(categoryController.getCategory));
categoryRouter.post("/", asyncHandler(categoryController.createCategory));
categoryRouter.put("/:id", asyncHandler(categoryController.updateCategory));
categoryRouter.delete("/:id", asyncHandler(categoryController.deleteCategory));

export default categoryRouter;
