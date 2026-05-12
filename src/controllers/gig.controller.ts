import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendCreated, sendNoContent } from "../utils/ApiResponse";
import { gigService } from "../services/gig.service";

// GET /api/v1/gigs
export const getGigs = asyncHandler(async (req: Request, res: Response) => {
  const result = await gigService.getGigs(req.query as any);
  sendSuccess(res, result.gigs, "Gigs fetched successfully", 200, result.meta);
});

// GET /api/v1/gigs/:id
export const getGigById = asyncHandler(async (req: Request, res: Response) => {
  const gig = await gigService.getGigById(req.params.id);
  sendSuccess(res, gig, "Gig fetched successfully");
});

// GET /api/v1/gigs/slug/:slug
export const getGigBySlug = asyncHandler(async (req: Request, res: Response) => {
  const gig = await gigService.getGigBySlug(req.params.slug);
  sendSuccess(res, gig, "Gig fetched successfully");
});

// POST /api/v1/gigs
export const createGig = asyncHandler(async (req: Request, res: Response) => {
  const gig = await gigService.createGig(req.user!.userId, req.body);
  sendCreated(res, gig, "Gig created successfully");
});

// PUT /api/v1/gigs/:id
export const updateGig = asyncHandler(async (req: Request, res: Response) => {
  const gig = await gigService.updateGig(req.params.id, req.user!.userId, req.body);
  sendSuccess(res, gig, "Gig updated successfully");
});

// DELETE /api/v1/gigs/:id
export const deleteGig = asyncHandler(async (req: Request, res: Response) => {
  await gigService.deleteGig(req.params.id, req.user!.userId, req.user!.role);
  sendNoContent(res);
});

// GET /api/v1/gigs/:id/related
export const getRelatedGigs = asyncHandler(async (req: Request, res: Response) => {
  const gig = await gigService.getGigById(req.params.id);
  const related = await gigService.getRelatedGigs(req.params.id, gig.category);
  sendSuccess(res, related, "Related gigs fetched");
});

// GET /api/v1/gigs/my — freelancer's own gigs
export const getMyGigs = asyncHandler(async (req: Request, res: Response) => {
  const result = await gigService.getMyGigs(req.user!.userId, req.query as any);
  sendSuccess(res, result.gigs, "Your gigs fetched", 200, result.meta);
});