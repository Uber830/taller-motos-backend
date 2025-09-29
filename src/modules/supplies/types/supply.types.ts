export interface CreateSupplyDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export interface UpdateSupplyDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export interface Supply {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  workshopId: string;
  createdAt: Date;
  updatedAt: Date;
}
