import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FileText, Tag, BarChart3, Plus, Trash2, CheckCircle2 } from "lucide-react";

function CreateProblemPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    difficulty: "Easy",
  });

  const [testCases, setTestCases] = useState([
    { input: "", expectedOutput: "", isHidden: false },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "", isHidden: false }]);
  };

  const removeTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/api/problems",
        { ...formData, testCases },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Problem created successfully!");
      setTimeout(() => navigate("/interviewer-dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-text mb-1">Create New Problem</h1>
        <p className="text-sm text-muted mb-6">Add a problem to the question bank</p>

        {error && (
          <div className="bg-red/15 text-red text-sm rounded-lg px-4 py-2.5 mb-4 border border-red/20">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green/15 text-green text-sm rounded-lg px-4 py-2.5 mb-4 border border-green/20 flex items-center gap-2">
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-panel border border-border rounded-2xl p-6 shadow-sm">
          
          <div className="mb-4">
            <label className="block text-sm text-muted mb-1.5 flex items-center gap-1.5">
              <FileText size={14} /> Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Two Sum"
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-text outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-muted mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Given an array of integers..."
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-text outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-muted mb-1.5 flex items-center gap-1.5">
                <Tag size={14} /> Topic
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Array"
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-text outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5 flex items-center gap-1.5">
                <BarChart3 size={14} /> Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-text outline-none focus:border-accent transition-colors"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <h3 className="text-text font-semibold text-sm">Test Cases</h3>
            <button
              type="button"
              onClick={addTestCase}
              className="flex items-center gap-1 text-accent text-sm font-semibold hover:underline"
            >
              <Plus size={14} /> Add Test Case
            </button>
          </div>

          {testCases.map((tc, index) => (
            <div key={index} className="bg-input border border-border rounded-lg p-4 mb-3">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="block text-xs text-muted mb-1">Input</label>
                  <input
                    type="text"
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Expected Output</label>
                  <input
                    type="text"
                    value={tc.expectedOutput}
                    onChange={(e) => handleTestCaseChange(index, "expectedOutput", e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tc.isHidden}
                    onChange={(e) => handleTestCaseChange(index, "isHidden", e.target.checked)}
                  />
                  Hidden test case
                </label>

                {testCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTestCase(index)}
                    className="flex items-center gap-1 text-red text-xs font-semibold hover:underline"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-accent text-white font-bold py-3 rounded-lg mt-4 hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            Create Problem
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProblemPage;