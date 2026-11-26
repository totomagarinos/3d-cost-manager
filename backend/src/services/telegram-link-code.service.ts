import crypto from "crypto";
import { TelegramLinkCode, User } from "../models";

export const generateLinkCode = () => {
  const code = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  return code;
};

export const createLinkCode = async (userId: string) => {
  await TelegramLinkCode.deleteMany({ userId });

  const code = generateLinkCode();

  await TelegramLinkCode.create({
    userId: userId,
    code: code,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  return code;
};

export const consumeLinkCode = async (code: string, chatId: string) => {
  const linkCode = await TelegramLinkCode.findOneAndDelete({
    code,
    expiresAt: { $gt: new Date() },
  });

  if (!linkCode) return null;

  return User.findByIdAndUpdate(
    linkCode.userId,
    { telegramChatId: chatId },
    { new: true },
  );
};
