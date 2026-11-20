import { Router } from "express";
import authRoutes from "./auth.routes";
import courseRoutes from "./course.routes";
import batchRoutes from "./batch.routes";
import enrollmentRoutes from "./enrollment.routes";
import userRoutes from "./user.routes";

const rootRouter = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/course", courseRoutes);
rootRouter.use("/batch", batchRoutes);
rootRouter.use("/enrollment", enrollmentRoutes);
rootRouter.use("/user", userRoutes);

export default rootRouter;
