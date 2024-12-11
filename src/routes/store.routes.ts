import {Router} from "express";
import * as storeController from "../controllers/store.controller";
import {asyncHandler} from "../utils/asyncHandler";

const storeRouter = Router();

storeRouter.get("/", asyncHandler(storeController.getStores));
storeRouter.get("/:id", asyncHandler(storeController.getStore));
storeRouter.post("/", asyncHandler(storeController.createStore));
storeRouter.put("/:id", asyncHandler(storeController.updateStore));
storeRouter.delete("/:id", asyncHandler(storeController.deleteStore));

export default storeRouter;
