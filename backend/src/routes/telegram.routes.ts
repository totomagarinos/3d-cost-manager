import { Router, type Request, type Response } from "express";
import {
  authenticateToken,
  type AuthenticatedRequest,
} from "../middlewares/auth";
import {
  consumeLinkCode,
  createLinkCode,
} from "../services/telegram-link-code.service";
import { User } from "../models";
import { TelegramService } from "../services";

export const telegramRouter = Router();

telegramRouter.post(
  "/webhook",
  async (req: Request, res: Response): Promise<void> => {
    const secretToken = req.header("X-Telegram-Bot-Api-Secret-Token");
    if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      res.status(401).send("Unauthorized");
      return;
    }

    const message = req.body.message;

    if (!message || !message.text) {
      res.status(200).send("OK");
      return;
    }

    const text = message.text.trim();
    const chatId = String(message.chat.id);

    const startPayload = text.match(/^\/start\s+([a-zA-Z0-9]{8})$/)?.[1];
    const bareCode = /^[a-zA-Z0-9]{8}$/.test(text) ? text : undefined;
    const code = startPayload ?? bareCode;

    // Intento de vinculación
    if (code) {
      const user = await consumeLinkCode(code, chatId);

      if (!user) {
        await TelegramService.sendMessage({
          chat_id: chatId,
          text: "El código no es válido o ya venció. Generá uno nuevo desde la app.",
        });
        res.status(200).send("OK");
        return;
      }

      await TelegramService.sendMessage({
        chat_id: chatId,
        text: "✅ Cuenta vinculada. Ya podés registrar ventas escribiéndome.",
      });
      res.status(200).send("OK");
      return;
    }

    // /start sin código (saludo)
    if (text === "/start") {
      await TelegramService.sendMessage({
        chat_id: chatId,
        text: "Para vincular tu cuenta, generá un código en la app y mandámelo así: /start CODIGO",
      });
      res.status(200).send("OK");
      return;
    }

    // Mensaje de venta
    const user = await User.findOne({ telegramChatId: chatId });

    if (!user) {
      await TelegramService.sendMessage({
        chat_id: chatId,
        text: "Primero vinculá tu cuenta desde la app.",
      });
      res.status(200).send("OK");
      return;
    }

    await TelegramService.sendMessage({
      chat_id: chatId,
      text: "Recibido. La carga de ventas todavía no está activa.",
    });
    res.status(200).send("OK");
  },
);

telegramRouter.post(
  "/link-code",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;

    const code = await createLinkCode(userId);

    res.status(200).json({ code });
  },
);
