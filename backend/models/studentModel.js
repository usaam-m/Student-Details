import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  course: { type: String, required: true },
  city: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
