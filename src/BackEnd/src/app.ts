import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { HTTP_STATUS } from "./constants/httpStatus.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { aquariumRouter } from "./modules/aquariums/aquarium.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { shrimpRouter } from "./modules/shrimps/shrimp.routes.js";

export const app = express();

app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/aquariums", aquariumRouter);
app.use("/api/shrimps", shrimpRouter);

app.use((_request, response) => {
  response.status(HTTP_STATUS.NOT_FOUND).json({ message: "Route not found" });
});

app.use(errorHandler);
