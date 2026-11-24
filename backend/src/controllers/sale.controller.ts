import { parse } from "valibot";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth";
import { CreateSaleSchema } from "../schemas/sale.schema";
import { SaleService } from "../services";

export class SaleController {
  static create = async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = parse(CreateSaleSchema, req.body);
    const userId = (req.user as { userId: string }).userId;

    const newSale = await SaleService.createSale(validatedData, userId);

    res.status(201).json(newSale);
  };

  static getAll = async (req: AuthenticatedRequest, res: Response) => {
    const userId = (req.user as { userId: string }).userId;

    const sales = await SaleService.getAllSales(userId);

    res.status(200).json(sales);
  };

  static delete = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "ID is required" });
    }

    const userId = (req.user as { userId: string }).userId;

    const deletedSale = await SaleService.delete(id, userId);

    if (!deletedSale) {
      return res.status(404).json({ message: "Sale not found." });
    }

    return res.status(200).json(deletedSale);
  };
}
