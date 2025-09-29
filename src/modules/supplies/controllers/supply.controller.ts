import { Response, NextFunction } from "express";
import {
  createSupply,
  getSupplies,
  getSupplyById,
  updateSupply,
  deleteSupply,
} from "../services/supply.service";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
import { CreateSupplyDto, UpdateSupplyDto } from "../types/supply.types";

/**
 * Controller for supply management
 * @module supply/controller
 * @category Controllers
 */

export const createController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workshopId = req.workshopId as string;
    const supplyData = req.body as CreateSupplyDto;

    const supply = await createSupply(workshopId, supplyData);
    res.status(201).json(supply);
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
    const supplies = await getSupplies(workshopId);
    res.status(200).json(supplies);
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

    const supply = await getSupplyById(workshopId, id);
    res.status(200).json(supply);
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
    const supplyData = req.body as UpdateSupplyDto;

    const updatedSupply = await updateSupply(workshopId, id, supplyData);
    res.status(200).json(updatedSupply);
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

    const result = await deleteSupply(workshopId, id);
    res.status(200).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
