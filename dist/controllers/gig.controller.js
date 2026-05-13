"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyGigs = exports.getRelatedGigs = exports.deleteGig = exports.updateGig = exports.createGig = exports.getGigBySlug = exports.getGigById = exports.getGigs = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const gig_service_1 = require("../services/gig.service");
exports.getGigs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await gig_service_1.gigService.getGigs(req.query);
    (0, ApiResponse_1.sendSuccess)(res, result.gigs, "Gigs fetched successfully", 200, result.meta);
});
exports.getGigById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const gig = await gig_service_1.gigService.getGigById(req.params.id);
    (0, ApiResponse_1.sendSuccess)(res, gig, "Gig fetched successfully");
});
exports.getGigBySlug = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const gig = await gig_service_1.gigService.getGigBySlug(req.params.slug);
    (0, ApiResponse_1.sendSuccess)(res, gig, "Gig fetched successfully");
});
exports.createGig = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const gig = await gig_service_1.gigService.createGig(req.user.userId, req.body);
    (0, ApiResponse_1.sendCreated)(res, gig, "Gig created successfully");
});
exports.updateGig = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const gig = await gig_service_1.gigService.updateGig(req.params.id, req.user.userId, req.body);
    (0, ApiResponse_1.sendSuccess)(res, gig, "Gig updated successfully");
});
exports.deleteGig = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await gig_service_1.gigService.deleteGig(req.params.id, req.user.userId, req.user.role);
    (0, ApiResponse_1.sendNoContent)(res);
});
exports.getRelatedGigs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const gig = await gig_service_1.gigService.getGigById(req.params.id);
    const related = await gig_service_1.gigService.getRelatedGigs(req.params.id, gig.category);
    (0, ApiResponse_1.sendSuccess)(res, related, "Related gigs fetched");
});
exports.getMyGigs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await gig_service_1.gigService.getMyGigs(req.user.userId, req.query);
    (0, ApiResponse_1.sendSuccess)(res, result.gigs, "Your gigs fetched", 200, result.meta);
});
//# sourceMappingURL=gig.controller.js.map