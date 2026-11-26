export class TelegramService {
  static sendMessage = async ({
    chat_id,
    text,
  }: {
    chat_id: string;
    text: string;
  }) => {
    try {
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
      const apiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text }),
      });

      if (!response.ok) {
        console.error(`Telegram respondió ${response.status}`);
        return;
      }
    } catch (error) {
      console.error("Error while fetching telegram api.");
    }
  };
}
