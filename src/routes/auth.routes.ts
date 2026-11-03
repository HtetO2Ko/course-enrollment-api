import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { AuthRepository } from "../repositories/auth.repository";

const router = Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/login", authController.login);
router.post("/register", authController.register);

router.post("/renew-access-token", authController.renewAccessToken);
router.post("/renew-refresh-token", authController.renewRefreshToken);

export default router;
