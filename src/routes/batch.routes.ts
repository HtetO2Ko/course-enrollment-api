import { Router } from "express";
import { BatchController } from "../controllers/batch.controller";
import { BatchService } from "../services/batch.service";
import { BatchRepo } from "../repositories/batch.repository";
import { restrictTo, verifyToken } from "../middlewares/auth.middleware";

const router = Router();

const batchRepository = new BatchRepo();
const batchService = new BatchService(batchRepository);
const batchController = new BatchController(batchService);

router.use(verifyToken);

router.post("/create", restrictTo("ADMIN"), batchController.create);
router.get("/get", restrictTo("ADMIN"), batchController.get);
router.patch("/update", restrictTo("ADMIN"), batchController.update);
router.delete("/delete", restrictTo("ADMIN"), batchController.delete);

export default router;
