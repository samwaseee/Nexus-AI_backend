import { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  meta?: PaginationMeta;

  constructor(
    statusCode: number,
    message: string,
    data: T | null = null,
    meta?: PaginationMeta
  ) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }
}

// ─── Convenience helpers ──────────────────────────────────────────────────

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: PaginationMeta
): Response => {
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, message, data, meta));
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message = "Created successfully"
): Response => {
  return res.status(201).json(new ApiResponse(201, message, data));
};

export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};

export const buildPaginationMeta = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};