import {Router} from "express";
import * as categoryController from "../controllers/category.controller";
import {authMiddleware} from "../middleware/auth.middleware";
import {asyncHandler} from "../utils/asyncHandler";

const categoryRouter = Router();

categoryRouter.get("/", asyncHandler(categoryController.getCategories));
categoryRouter.get("/:id", asyncHandler(categoryController.getCategory));
categoryRouter.post("/", authMiddleware, asyncHandler(categoryController.createCategory));
categoryRouter.put("/:id", authMiddleware, asyncHandler(categoryController.updateCategory));
categoryRouter.delete("/:id", authMiddleware, asyncHandler(categoryController.deleteCategory));

export default categoryRouter;
