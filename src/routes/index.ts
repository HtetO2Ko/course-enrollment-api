import { Router } from "express";
import authRoutes from "./auth.routes";
import courseRoutes from "./course.routes";

const rootRouter = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/courses", courseRoutes);

export default rootRouter;
