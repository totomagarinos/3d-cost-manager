export interface Sale {
  id: string;
  title: string;
  salePrice: number;
  cost?: number;
  clientName?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateSaleDTO = Omit<Sale, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
