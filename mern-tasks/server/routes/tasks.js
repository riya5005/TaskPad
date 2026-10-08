import { Router } from "express";
import Task from "../models/Task.js";

const router = Router();

// Read all tasks (newest first)
router.get("/", async (_req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// Create a task
router.post("/", async (req, res) => {
  const title = (req.body.title || "").trim();
  if (!title) return res.status(400).json({ error: "Title is required." });
  const task = await Task.create({ title });
  res.status(201).json(task);
});

// Update a task (toggle done or rename)
router.patch("/:id", async (req, res) => {
  const { title, done } = req.body;
  const update = {};
  if (typeof title === "string" && title.trim()) update.title = title.trim();
  if (typeof done === "boolean") update.done = done;
  const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!task) return res.status(404).json({ error: "Task not found." });
  res.json(task);
});

// Delete a task
router.delete("/:id", async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found." });
  res.json({ ok: true });
});

export default router;
