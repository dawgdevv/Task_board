import mongoose from "mongoose";

const taskListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add compound indexes
taskListSchema.index({ user: 1, createdAt: -1 });
taskListSchema.index({ goal: 1, user: 1 });
taskListSchema.index({ user: 1, goal: 1 });

export default mongoose.model("TaskList", taskListSchema);
