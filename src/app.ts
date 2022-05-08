import cors from "cors";
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import e2eTestRouter from "./routers/e2eTestRouter.js";
import recommendationRouter from "./routers/recommendationRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/recommendations", recommendationRouter);
process.env.NODE_ENV === "test" && app.use("/recommendations", e2eTestRouter);
app.use(errorHandlerMiddleware);

export default app;
