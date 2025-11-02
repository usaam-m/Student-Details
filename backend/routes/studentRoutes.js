import express from "express";
import Student from "../models/studentModel.js";

const router = express.Router();

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Add new student
router.post("/", async (req, res) => {
  const { name, dob, course, city } = req.body;
  if (!name || !dob || !course || !city)
    return res.status(400).json({ error: "All fields required" });

  try {
    const student = new Student({ name, dob, course, city });
    await student.save();
    res.status(201).json(student);
  } catch {
    res.status(500).json({ error: "Failed to save student" });
  }
});

// Update student
router.put("/:id", async (req, res) => {
  const { name, dob, course, city } = req.body;
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { name, dob, course, city },
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update" });
  }
});

// Delete student
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
