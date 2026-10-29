import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function PracticePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/problems");
        setProblems(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems =
    selectedDifficulty === "All"
      ? problems
      : problems.filter((p) => p.difficulty === selectedDifficulty);

  const difficultyColor = (level) => {
    if (level === "Easy") return "bg-green/15 text-green";
    if (level === "Medium") return "bg-amber/15 text-amber";
    return "bg-red/15 text-red";
  };

  return (
    <div className="min-h-screen bg-bg p-8">
      <h1 className="text-xl font-bold text-text mb-1">Practice Problems</h1>
      <p className="text-sm text-muted mb-6">
        Sharpen your skills across topics
      </p>

      <div className="flex gap-2 mb-6">
        {["All", "Easy", "Medium", "Hard"].map((level) => (
          <button
            key={level}
            onClick={() => setSelectedDifficulty(level)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border border-border ${
              selectedDifficulty === level
                ? "bg-accent text-white"
                : "text-muted bg-panel"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="bg-panel border border-border rounded-2xl overflow-hidden">
        {filteredProblems.map((problem) => (
          <Link key={problem._id} to={`/practice/${problem._id}`}>
            <div className="flex justify-between items-center px-5 py-4 border-b border-border last:border-b-0 hover:bg-panel2 cursor-pointer">
              <div>
                <p className="text-text font-semibold">{problem.title}</p>
                
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyColor(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PracticePage;