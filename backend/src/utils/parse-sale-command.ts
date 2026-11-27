interface ParsedSaleCommand {
  title: string;
  salePrice: number;
}

export const parseSaleCommand = (text: string): ParsedSaleCommand | null => {
  const tokens = text.trim().split(/\s+/).filter(Boolean);

  const priceToken = tokens.at(-1);
  if (!priceToken) return null;

  const raw = priceToken.replace(/[$.]/g, "");
  if (!/^\d+$/.test(raw)) return null;
  const salePrice = Number(raw);

  const titleToken = tokens.slice(0, -1);
  if (titleToken.length === 0) return null;

  const title = titleToken.join(" ");

  return { title, salePrice };
};
