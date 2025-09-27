export interface CreateServiceDto {
  name: string;
}

export interface UpdateServiceDto {
  name?: string;
}

export interface Service {
  id: string;
  name: string;
  workshopId: string;
  createdAt: Date;
  updatedAt: Date;
}
