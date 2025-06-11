import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskList",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Enhanced indexes for better performance
taskSchema.index({ user: 1, list: 1 });
taskSchema.index({ list: 1, createdAt: -1 });
taskSchema.index({ user: 1, completed: 1 });
taskSchema.index({ user: 1, createdAt: -1 }); // Added for user task sorting
taskSchema.index({ list: 1, completed: 1, createdAt: -1 }); // Compound index for filtering

export default mongoose.model("Task", taskSchema);
