import {
  maxLength,
  minValue,
  nonEmpty,
  number,
  object,
  optional,
  pipe,
  string,
  type InferOutput,
} from "valibot";

export const CreateSaleSchema = object({
  title: pipe(string("Title is required."), nonEmpty(), maxLength(200)),
  salePrice: pipe(number(), minValue(0)),
  cost: optional(pipe(number(), minValue(0))),
  clientName: optional(pipe(string(), maxLength(100))),
  notes: optional(pipe(string(), maxLength(1000))),
});

export type CreateSaleDTO = InferOutput<typeof CreateSaleSchema>;
