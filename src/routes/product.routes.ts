import {Router} from "express";
import * as productController from "../controllers/product.controller";
import {authMiddleware} from "../middleware/auth.middleware";
import {asyncHandler} from "../utils/asyncHandler";

const productRouter = Router();

productRouter.get("/", asyncHandler(productController.getProducts));
productRouter.get("/:id", asyncHandler(productController.getProduct));
productRouter.post("/", authMiddleware, asyncHandler(productController.createProduct));
productRouter.put("/:id", authMiddleware, asyncHandler(productController.updateProduct));
productRouter.delete("/:id", authMiddleware, asyncHandler(productController.deleteProduct));

export default productRouter;
