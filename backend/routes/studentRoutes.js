import express from "express";
import Student from "../models/studentModel.js";

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE student (with validation + duplicate check)
router.post("/", async (req, res) => {
  const { name, dob, course, city } = req.body;

  if (!name || !dob || !course || !city)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const existing = await Student.findOne({ name, course, city });
    if (existing) return res.status(409).json({ error: "Duplicate student found" });

    const student = new Student({ name, dob, course, city });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: "Failed to create student" });
  }
});

// UPDATE student
router.put("/:id", async (req, res) => {
  const { name, dob, course, city } = req.body;

  if (!name || !dob || !course || !city)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const duplicate = await Student.findOne({
      _id: { $ne: req.params.id },
      name,
      course,
      city,
    });

    if (duplicate)
      return res.status(409).json({ error: "Duplicate student exists" });

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { name, dob, course, city },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Student not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update student" });
  }
});

// DELETE student
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

export default router;
