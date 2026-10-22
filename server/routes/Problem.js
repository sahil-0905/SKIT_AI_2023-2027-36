import express from "express";
import Problem from "../models/Problem.js";

const router = express.Router();

// Get all problems (list ke liye - PracticePage me use hoga)
router.get("/", async (req, res) => {
    try {
        const problems = await Problem.find().select("-testCases");
        res.status(200).json(problems);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching problems" });
    }
});

// Get single problem by id (ProblemSolvePage me use hoga)
router.get("/:id", async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json(problem);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching problem" });
    }
});

// Create a new problem (Postman se testing / future me teacher panel se use hoga)
router.post("/", async (req, res) => {
    const { title, description, difficulty, topic, testCases } = req.body;

    try {
        const newProblem = new Problem({
            title,
            description,
            difficulty,
            topic,
            testCases,
        });

        await newProblem.save();
        res.status(201).json({ message: "Problem created successfully", problem: newProblem });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating problem" });
    }
});

export default router;