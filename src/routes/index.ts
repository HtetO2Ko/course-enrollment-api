import { Router } from "express";
import authRoutes from "./auth.routes";
import courseRoutes from "./course.routes";
import batchRoutes from "./batch.routes";
import enrollmentRoute from "./enrollment.routes";

const rootRouter = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/course", courseRoutes);
rootRouter.use("/batch", batchRoutes);
rootRouter.use("/enrollment", enrollmentRoute);

export default rootRouter;
