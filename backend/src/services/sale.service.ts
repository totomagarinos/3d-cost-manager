import { Sale } from "../models";
import type { CreateSaleDTO } from "../schemas/sale.schema";

export class SaleService {
  static createSale = async (data: CreateSaleDTO, userId: string) => {
    const sale = await Sale.create({ ...data, userId });
    return sale;
  };

  static getAllSales = async (userId: string) => {
    const sales = await Sale.find({ userId }).sort({ createdAt: -1 });
    return sales;
  };

  static delete = async (id: string, userId: string) => {
    const deletedSale = await Sale.findByIdAndDelete({ _id: id, userId });
    return deletedSale;
  };
}
