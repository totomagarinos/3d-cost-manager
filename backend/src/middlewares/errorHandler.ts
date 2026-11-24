import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { isValiError } from "valibot";
import mongoose from "mongoose";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (isValiError(err)) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  console.error("Unexpected error", err);
  res.status(500).json({ message: "Internal server error" });
};
