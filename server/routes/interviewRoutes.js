import express from "express";
import protect from "../middleware/authmiddleware.js";
import restrictTo from "../middleware/roleMiddleware.js";
import {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  cancelInterview,
} from "../controllers/interviewController.js";

const router = express.Router();

// Every interview route needs a logged-in user
router.use(protect);

// Schedule an interview (interviewer only)
router.post("/", restrictTo("interviewer"), createInterview);

// List my interviews (interviewer: ones I created, student: ones assigned to me)
router.get("/", getInterviews);
// Kept so the existing Student/Interviewer dashboards keep working
router.get("/my-sessions", getInterviews);

// Single interview (only its interviewer or candidate)
router.get("/:id", getInterviewById);

// Reschedule/update (interviewer) or accept/decline invitation (student) - checked in controller
router.patch("/:id", updateInterview);

// Cancel (interviewer only)
router.delete("/:id", restrictTo("interviewer"), cancelInterview);

export default router;