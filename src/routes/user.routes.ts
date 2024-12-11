import {Router} from "express";
import * as userController from "../controllers/user.controller";
import {asyncHandler} from "../utils/asyncHandler";

const userRouter = Router();

userRouter.post("/login", asyncHandler(userController.login));
userRouter.post("/register", asyncHandler(userController.createUser));
userRouter.get("/", asyncHandler(userController.getUsers));
userRouter.get("/:id", asyncHandler(userController.getUser));
userRouter.put("/:id", asyncHandler(userController.updateUser));
userRouter.delete("/:id", asyncHandler(userController.deleteUser));


export default userRouter;
