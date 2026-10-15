import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

function ProblemSolvePage() {
  const { id } = useParams();

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// write your code here");
  const [problem, setProblem] = useState(null);

  // Judge0 states
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/problems/${id}`
        );

        setProblem(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProblem();
  }, [id]);

  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp" },
  ];

  // =========================
  // RUN CODE
  // =========================

  const runCode = async () => {
    try {
      setIsRunning(true);
      setOutput("");

      const languageIds = {
        javascript: 63,
        python: 71,
        java: 62,
        cpp: 54,
      };

      const response = await axios.post(
        "http://localhost:8080/api/execute",
        {
          source_code: code,
          language_id: languageIds[language],
          stdin: "",
        }
      );

      console.log("Judge0 response:", response.data);

      if (response.data.stdout) {
        setOutput(response.data.stdout);
      } else if (response.data.compile_output) {
        setOutput(response.data.compile_output);
      } else if (response.data.stderr) {
        setOutput(response.data.stderr);
      } else {
        setOutput(
          response.data.status?.description || "No output"
        );
      }
    } catch (error) {
      console.error("Execution error:", error);

      setOutput("Code execution failed.");
    } finally {
      setIsRunning(false);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-bg text-text p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-6 flex gap-6">

      {/* =========================
          LEFT SIDE - PROBLEM
      ========================= */}

      <div className="w-1/3 bg-panel border border-border rounded-2xl p-6">

        <h2 className="text-text font-bold text-lg mb-2">
          {problem.title}
        </h2>

        <span className="text-xs text-muted mb-4 inline-block">
          {problem.topic} · {problem.difficulty}
        </span>

        <p className="text-muted text-sm whitespace-pre-line">
          {problem.description}
        </p>

        {/* Test Cases */}

        <h3 className="text-text font-semibold text-sm mb-3 mt-6">
          Sample Test Cases
        </h3>

        {problem.testCases
          .filter((tc) => !tc.isHidden)
          .map((tc, index) => (
            <div
              key={index}
              className="bg-input border border-border rounded-lg p-3 mb-2 text-xs"
            >
              <p className="text-muted mb-1">
                <span className="font-semibold text-text">
                  Input:
                </span>{" "}
                {tc.input}
              </p>

              <p className="text-muted">
                <span className="font-semibold text-text">
                  Expected Output:
                </span>{" "}
                {tc.expectedOutput}
              </p>
            </div>
          ))}
      </div>

      {/* =========================
          RIGHT SIDE - EDITOR
      ========================= */}

      <div className="flex-1 bg-panel border border-border rounded-2xl overflow-hidden flex flex-col">

        {/* Header */}

        <div className="flex justify-between items-center px-4 py-2 border-b border-border">

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-input border border-border text-text text-sm rounded-lg px-3 py-1.5 outline-none"
          >
            {languages.map((lang) => (
              <option
                key={lang.value}
                value={lang.value}
              >
                {lang.label}
              </option>
            ))}
          </select>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="bg-accent text-white text-sm font-bold px-4 py-1.5 rounded-lg disabled:opacity-50"
          >
            {isRunning ? "Running..." : "Run"}
          </button>

        </div>

        {/* Monaco Editor */}

        <Editor
          height="65vh"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
        />

        {/* =========================
            OUTPUT
        ========================= */}

        <div className="border-t border-border p-4">

          <h3 className="text-text font-semibold text-sm mb-2">
            Output
          </h3>

          <pre className="bg-input text-text p-3 rounded-lg text-sm min-h-[80px] whitespace-pre-wrap">
            {output || "Run your code to see output"}
          </pre>

        </div>

      </div>
    </div>
  );
}

export default ProblemSolvePage;