import { parse } from "valibot";
import type { Response } from "express";
import { CreateMaterialSchema, UpdateMaterialSchema } from "../schemas";
import { MaterialService } from "../services";
import type { AuthenticatedRequest } from "../middlewares/auth";

export class MaterialController {
  static create = async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = parse(CreateMaterialSchema, req.body);
    const userId = (req.user as { userId: string }).userId;

    const newMaterial = await MaterialService.createMaterial(
      validatedData,
      userId,
    );

    res.status(201).json(newMaterial);
  };

  static getAll = async (req: AuthenticatedRequest, res: Response) => {
    const userId = (req.user as { userId: string }).userId;

    const materials = await MaterialService.getAllMaterials(userId);

    res.status(200).json(materials);
  };

  static update = async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = parse(UpdateMaterialSchema, req.body);

    const { id } = req.params;
    if (typeof id !== "string")
      return res.status(400).json({ message: "ID is required." });

    const userId = (req.user as { userId: string }).userId;

    const updatedMaterial = await MaterialService.updateMaterial(
      id,
      validatedData,
      userId,
    );

    if (!updatedMaterial) {
      return res.status(404).json({ message: "Material not found." });
    }

    res.status(200).json(updatedMaterial);
  };

  static delete = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string")
      return res.status(400).json({ message: "ID is required." });

    const userId = (req.user as { userId: string }).userId;

    const deletedMaterial = await MaterialService.deleteMaterial(id, userId);

    if (!deletedMaterial) {
      return res.status(404).json({ message: "Material not found." });
    }

    return res.status(200).json(deletedMaterial);
  };
}
