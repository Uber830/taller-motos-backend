import { Response, NextFunction } from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../services/service.service";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
import type {
  CreateServiceDto,
  UpdateServiceDto,
} from "../types/service.types";

/**
 * Controller for service management
 * @module service/controller
 * @category Controllers
 */

export const createController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workshopId = req.workshopId as string;
    const serviceData = req.body as CreateServiceDto;

    const service = await createService(workshopId, serviceData);
    res.status(201).json(service);
  } catch (error: unknown) {
    next(error);
  }
};

export const getControllers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workshopId = req.workshopId as string;
    const services = await getServices(workshopId);
    res.status(200).json(services);
  } catch (error: unknown) {
    next(error);
  }
};

export const getByIdController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workshopId = req.workshopId as string;
    const { id } = req.params;

    const service = await getServiceById(workshopId, id);
    res.status(200).json(service);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workshopId = req.workshopId as string;
    const { id } = req.params;
    const serviceData = req.body as UpdateServiceDto;

    const updatedService = await updateService(workshopId, id, serviceData);
    res.status(200).json(updatedService);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workshopId = req.workshopId as string;
    const { id } = req.params;

    const result = await deleteService(workshopId, id);
    res.status(200).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
