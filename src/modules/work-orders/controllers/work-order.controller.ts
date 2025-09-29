import { Response, NextFunction } from "express";
import {
  createWorkOrder,
  getWorkOrders,
  getWorkOrderById,
  updateWorkOrder,
  deleteWorkOrder,
} from "../services/work-order.service";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
import {
  CreateWorkOrderDto,
  UpdateWorkOrderDto,
} from "../types/work-order.types";

/**
 * Controller for work order management
 * @module work-order/controller
 * @category Controllers
 */

export const createController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const workshopId = req.workshopId as string;
    const workOrderData = req.body as CreateWorkOrderDto;

    const workOrder = await createWorkOrder(workshopId, workOrderData);
    res.status(201).json(workOrder);
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
    const result = await getWorkOrders(workshopId);
    res.status(200).json(result);
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

    const workOrder = await getWorkOrderById(workshopId, id);
    res.status(200).json(workOrder);
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
    const workOrderData = req.body as UpdateWorkOrderDto;

    const updatedWorkOrder = await updateWorkOrder(
      workshopId,
      id,
      workOrderData,
    );
    res.status(200).json(updatedWorkOrder);
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
    const { id } = req.params;

    const result = await deleteWorkOrder(id);
    res.status(200).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
