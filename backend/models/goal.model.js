import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    targetDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
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

// Add compound indexes for better query performance
goalSchema.index({ user: 1, createdAt: -1 });
goalSchema.index({ user: 1, priority: 1 });
goalSchema.index({ user: 1, targetDate: 1 });
goalSchema.index({ user: 1, completed: 1 });

export default mongoose.model("Goal", goalSchema);
