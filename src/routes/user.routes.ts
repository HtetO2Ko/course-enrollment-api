import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepo } from "../repositories/user.repository";
import { verifyToken } from "../middlewares/auth.middleware";

const userRepository = new UserRepo();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.use(verifyToken);

router.get("/me", userController.getMe);
router.patch("/me", userController.updateMe);

export default router;
