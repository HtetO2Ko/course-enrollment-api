import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollment.controller";
import { EnrollmentService } from "../services/enrollment.service";
import { EnrollmentRepo } from "../repositories/enrollment.repository";
import { restrictTo, verifyToken } from "../middlewares/auth.middleware";

const router = Router();

const enrollmentRepository = new EnrollmentRepo();
const enrollmentService = new EnrollmentService(enrollmentRepository);
const enrollmentController = new EnrollmentController(enrollmentService);

router.use(verifyToken, restrictTo("USER"));

router.post("/create", enrollmentController.create);
router.get("/my-enrollments", enrollmentController.getMyEnrollments);
router.delete("/:enrollmentid", enrollmentController.removeMine);

export default router;
