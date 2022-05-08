import { Router } from "express";
import { resetDatabase } from "../controllers/e2eTestController.js";

const e2eTestRouter = Router();
e2eTestRouter.post("/reset", resetDatabase);
export default e2eTestRouter;
