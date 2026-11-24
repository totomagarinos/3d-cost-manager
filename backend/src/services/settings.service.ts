import { Settings } from "../models";
import type { UpdateSettingsDTO } from "../schemas";

export class SettingsService {
  static getSettings = async (userId: string) => {
    let settings = await Settings.findOne({ userId });

    if (!settings) {
      settings = await Settings.create({
        electricityPricePerKwH: 140,
        consumptionWatts: 120,
        machineWearPerHour: 4320,
        partsPrice: 150000,
        errorMarginPercentage: 5,
      });
    }

    return settings;
  };

  static updateSettings = async (data: UpdateSettingsDTO, userId: string) => {
    const updatedSettings = await Settings.findOneAndUpdate({ userId }, data, {
      new: true,
      upsert: true,
    });

    return updatedSettings;
  };
}
