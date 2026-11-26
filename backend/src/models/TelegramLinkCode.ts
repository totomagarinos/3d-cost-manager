import { model, Schema } from "mongoose";

export interface ITelegramLinkCode {
  userId: string;
  code: string;
  expiresAt: Date;
}

const telegramLinkCodeSchema = new Schema<ITelegramLinkCode>({
  userId: { type: String, required: true, ref: "User" },
  code: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

telegramLinkCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TelegramLinkCode = model<ITelegramLinkCode>(
  "TelegramLinkCode",
  telegramLinkCodeSchema,
);
