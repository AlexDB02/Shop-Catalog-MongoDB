import {Router} from "express";
import * as storeController from "../controllers/store.controller";
import {authMiddleware} from "../middleware/auth.middleware";
import {asyncHandler} from "../utils/asyncHandler";

const storeRouter = Router();

storeRouter.get("/", asyncHandler(storeController.getStores));
storeRouter.get("/:id", asyncHandler(storeController.getStore));
storeRouter.post("/", authMiddleware, asyncHandler(storeController.createStore));
storeRouter.put("/:id", authMiddleware, asyncHandler(storeController.updateStore));
storeRouter.delete("/:id", authMiddleware, asyncHandler(storeController.deleteStore));

export default storeRouter;
