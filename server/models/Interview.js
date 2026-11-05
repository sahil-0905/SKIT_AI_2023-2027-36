import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
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
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // minutes me
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },

    // --- Sprint 3 additions: invitation + cancellation tracking ---
    invitationStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Declined"],
      default: "Pending",
    },
    invitedAt: {
      type: Date,
      default: Date.now,
    },
    cancelledAt: Date,
    cancelReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("InterviewSession", interviewSessionSchema);