import { Material } from "../models";
import type { CreateMaterialDTO, UpdateMaterialDTO } from "../schemas";

export class MaterialService {
  static createMaterial = async (data: CreateMaterialDTO, userId: string) => {
    const material = await Material.create({ ...data, userId });

    return material;
  };

  static getAllMaterials = async (userId: string) => {
    const materials = await Material.find({ userId });
    return materials;
  };

  static updateMaterial = async (
    id: string,
    data: UpdateMaterialDTO,
    userId: string,
  ) => {
    const updatedMaterial = await Material.findByIdAndUpdate(
      { _id: id, userId },
      data,
      {
        returnDocument: "after",
      },
    );

    return updatedMaterial;
  };

  static deleteMaterial = async (id: string, userId: string) => {
    const deletedMaterial = await Material.findByIdAndDelete({
      _id: id,
      userId,
    });
    return deletedMaterial;
  };
}
