import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema(
  {
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },
    taskList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskList",
      required: false, // Optional - can log time for general goal work
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: false, // Optional - can log time for specific task
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
      min: 1,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ["planning", "execution", "review", "research", "meeting", "other"],
      default: "execution",
    },
    isTimerSession: {
      type: Boolean,
      default: false, // True if logged via timer, false if manually entered
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
timeLogSchema.index({ user: 1, createdAt: -1 });
timeLogSchema.index({ goal: 1, user: 1 });
timeLogSchema.index({ user: 1, goal: 1, createdAt: -1 });
timeLogSchema.index({ taskList: 1, user: 1 });
timeLogSchema.index({ task: 1, user: 1 });

// Virtual for formatted duration
timeLogSchema.virtual("formattedDuration").get(function () {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// Remove the pre-save hook since we're handling duration calculation in the controller

export default mongoose.model("TimeLog", timeLogSchema);
