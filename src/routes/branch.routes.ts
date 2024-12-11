import {Router} from "express";
import * as branchController from "../controllers/branch.controller";
import {asyncHandler} from "../utils/asyncHandler";

const branchRouter = Router();

branchRouter.get("/", asyncHandler(branchController.getBranches));
branchRouter.get("/:id", asyncHandler(branchController.getBranch));
branchRouter.post("/", asyncHandler(branchController.createBranch));
branchRouter.put("/:id", asyncHandler(branchController.updateBranch));
branchRouter.delete("/:id", asyncHandler(branchController.deleteBranch));

export default branchRouter;
