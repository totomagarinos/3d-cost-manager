import type { Response } from "express";
import { parse } from "valibot";
import { SettingsService } from "../services";
import { UpdateSettingsSchema } from "../schemas";
import type { AuthenticatedRequest } from "../middlewares/auth";

export class SettingsController {
  static get = async (req: AuthenticatedRequest, res: Response) => {
    const userId = (req.user as { userId: string }).userId;
    const settings = await SettingsService.getSettings(userId);
    res.status(200).json(settings);
  };

  static update = async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = parse(UpdateSettingsSchema, req.body);
    const userId = (req.user as { userId: string }).userId;

    const updatedSettings = await SettingsService.updateSettings(
      validatedData,
      userId,
    );

    res.status(200).json(updatedSettings);
  };
}
