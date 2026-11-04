import { Router } from "express";
import { BatchController } from "../controllers/batch.controller";
import { BatchService } from "../services/batch.service";
import { BatchRepo } from "../repositories/batch.repository";
import { restrictTo, verifyToken } from "../middlewares/auth.middleware";

const batchRepository = new BatchRepo();
const batchService = new BatchService(batchRepository);
const batchController = new BatchController(batchService);

const router = Router();

router.get("/getBatchesForUser", batchController.getBatchesForUser);

const adminRouter = Router();

adminRouter.use(verifyToken, restrictTo("ADMIN"));

adminRouter.post("/create", batchController.create);
adminRouter.get("/get", batchController.get);
adminRouter.patch("/update", batchController.update);
adminRouter.delete("/delete", batchController.delete);

router.use("/", adminRouter);

export default router;
