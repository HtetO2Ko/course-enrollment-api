import { Router } from "express";
import { CourseController } from "../controllers/course.controller";
import { CourseService } from "../services/course.service";
import { CourseRepo } from "../repositories/course.repository";
import { restrictTo, verifyToken } from "../middlewares/auth.middleware";

const router = Router();

const courseRepository = new CourseRepo();
const courseService = new CourseService(courseRepository);
const courseController = new CourseController(courseService);

router.use(verifyToken, restrictTo("ADMIN"));

router.post("/create", courseController.create);
router.get("/getAll", courseController.getAll);
router.patch("/update", courseController.update);

export default router;
