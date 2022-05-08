import { Request, Response } from "express";
import * as e2eTest from "../services/e2eTestService.js";

export async function resetDatabase(req: Request, res: Response) {
  await e2eTest.resetDatabase();
  return res.sendStatus(200);
}
