import {Router} from "express";
import * as searchController from "../controllers/search.controller";
import { asyncHandler } from "../utils/asyncHandler";

const searchRouter = Router();

searchRouter.get("/", asyncHandler(searchController.searchAll));
searchRouter.get("/stores", asyncHandler(searchController.itemDetails));

export default searchRouter;
