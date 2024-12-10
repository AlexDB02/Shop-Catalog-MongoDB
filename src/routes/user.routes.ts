import {Router} from "express";
import * as userController from "../controllers/user.controller";
import {authMiddleware} from "../middleware/auth.middleware";
import {asyncHandler} from "../utils/asyncHandler";

const userRouter = Router();

userRouter.post("/login", asyncHandler(userController.login));
userRouter.post("/register", asyncHandler(userController.createUser));
userRouter.get("/me", asyncHandler(userController.getMyUser));
userRouter.put("/me", asyncHandler(userController.updateMyUser));
userRouter.delete("/me", asyncHandler(userController.deleteMyUser));
userRouter.get("/", asyncHandler(userController.getUsers));
userRouter.get("/:id", asyncHandler(userController.getUser));


export default userRouter;
