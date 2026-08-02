import { Router } from "express";
import { exportAfiliadosToExcel } from "../controllers/export.js";
import { validateJWT } from "../middlewares/validateJWT.js";

export const exportToExcelRouter = Router();

exportToExcelRouter.get("/", validateJWT, exportAfiliadosToExcel);




