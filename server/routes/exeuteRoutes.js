import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { source_code, language_id, stdin } = req.body;

    console.log("=================================");
    console.log("Executing code...");
    console.log("Language ID:", language_id);
    console.log("Source Code:", source_code);
    console.log("=================================");

    const response = await axios.post(
      "http://localhost:2358/submissions?wait=true",
      {
        source_code,
        language_id,
        stdin: stdin || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("Judge0 Response:");
    console.log(response.data);

    res.json(response.data);

  } catch (error) {
    console.error("=================================");
    console.error("JUDGE0 ERROR");
    console.error("Message:", error.message);
    console.error("Response:", error.response?.data);
    console.error("Status:", error.response?.status);
    console.error("=================================");

    res.status(500).json({
      message: "Code execution failed",
      error: error.response?.data || error.message,
    });
  }
});

export default router;