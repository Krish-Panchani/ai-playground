import { Router } from "express";

import { getGallery } from "../../controllers/gallery.controller.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.get("/", asyncHandler(getGallery));

export default router;
