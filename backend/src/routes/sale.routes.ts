import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import { SaleController } from "../controllers";

export const saleRouter = Router();

saleRouter.use(authenticateToken);

saleRouter.post("/", SaleController.create);
saleRouter.get("/", SaleController.getAll);
saleRouter.delete("/:id", SaleController.delete);
