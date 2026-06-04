import { Router } from "express";

const router = Router();

router.get("/daily", (_req, res) => {
  res.status(501).json({ ok: false, message: "Not implemented yet" });
});

router.post("/daily/generate", (_req, res) => {
  res.status(501).json({ ok: false, message: "Not implemented yet" });
});

export default router;
