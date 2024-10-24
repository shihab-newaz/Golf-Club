// app/models/Course.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  name: string;
  description?: string;
  holes: number;
  par: number;
  length?: number;
  difficulty?: "easy" | "medium" | "hard";
  imageUrl?: string;
  isOpen: boolean;
}

const CourseSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    holes: { type: Number, required: true, default: 18 },
    par: { type: Number, required: true },
    length: { type: Number },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    imageUrl: { type: String },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
export default Course;
