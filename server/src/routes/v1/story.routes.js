import { Router } from "express";

const router = Router();

router.post("/", (_req, res) => {
  res.status(501).json({ ok: false, message: "Not implemented yet" });
});

router.get("/:id", (_req, res) => {
  res.status(501).json({ ok: false, message: "Not implemented yet" });
});

export default router;
