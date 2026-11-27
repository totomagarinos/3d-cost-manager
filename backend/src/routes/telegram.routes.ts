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
import { SaleService, TelegramService } from "../services";
import { parseSaleCommand } from "../utils/parse-sale-command";

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

    const extracted = parseSaleCommand(text);

    if (!extracted) {
      await TelegramService.sendMessage({
        chat_id: chatId,
        text: "Mandame: producto precio. Ej: Lampara 30000",
      });
      res.status(200).send("OK");
      return;
    }

    const sale = await SaleService.createSale(
      { title: extracted.title, salePrice: extracted.salePrice },
      user.id,
    );

    await TelegramService.sendMessage({
      chat_id: chatId,
      text: `✅ Vendido: ${sale.title} — $${sale.salePrice.toLocaleString("es-AR")}`,
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
