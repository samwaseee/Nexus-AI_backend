import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";
import { userService } from "../services/user.service";

const router = Router();

// GET /api/v1/talent — public talent listing with search + filter
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await userService.getTalentList(req.query as any);
    sendSuccess(res, result.users, "Talent fetched", 200, result.meta);
  })
);

// GET /api/v1/talent/:id — public freelancer profile
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await userService.getPublicProfile(req.params.id);
    sendSuccess(res, user, "Freelancer profile fetched");
  })
);

export default router;