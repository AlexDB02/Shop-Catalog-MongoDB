import {Router} from "express";
import * as productController from "../controllers/product.controller";
import {asyncHandler} from "../utils/asyncHandler";

const productRouter = Router();

productRouter.get("/", asyncHandler(productController.getProducts));
productRouter.get("/:id", asyncHandler(productController.getProduct));
productRouter.post("/", asyncHandler(productController.createProduct));
productRouter.put("/:id", asyncHandler(productController.updateProduct));
productRouter.delete("/:id", asyncHandler(productController.deleteProduct));

export default productRouter;
