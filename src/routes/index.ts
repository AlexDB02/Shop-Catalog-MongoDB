import {Router} from "express";
import categoryRouter from "./category.routes";
import userRouter from "./user.routes";
import storeRouter from "./store.routes";
import branchRouter from "./branch.routes";
import productRouter from "./product.routes";
import searchRouter from "./search.routes";

const router = Router();

router.use("/users", userRouter);
router.use("/stores", storeRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/branches", branchRouter);
router.use("/search", searchRouter);

export default router;
