import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FileText, Mail, Calendar, Clock, ListChecks, CheckCircle2 } from "lucide-react";

function ScheduleInterviewPage() {
  const navigate = useNavigate();
  const [allProblems, setAllProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    candidateEmail: "",
    scheduledAt: "",
    duration: 60,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/problems");
        setAllProblems(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProblems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleProblem = (problemId) => {
    if (selectedProblems.includes(problemId)) {
      setSelectedProblems(selectedProblems.filter((id) => id !== problemId));
    } else {
      setSelectedProblems([...selectedProblems, problemId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (selectedProblems.length === 0) {
      setError("Please select at least one problem");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/api/interviews",
        { ...formData, problems: selectedProblems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Interview scheduled successfully!");
      setTimeout(() => navigate("/interviewer-dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-text mb-1">Schedule Interview</h1>
        <p className="text-sm text-muted mb-6">Set up a new interview session</p>

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
              <FileText size={14} /> Interview Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Mock Interview — Arrays"
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-text outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-muted mb-1.5 flex items-center gap-1.5">
              <Mail size={14} /> Candidate Email
            </label>
            <input
              type="email"
              name="candidateEmail"
              value={formData.candidateEmail}
              onChange={handleChange}
              placeholder="student@example.com"
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-text outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-muted mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} /> Date & Time
              </label>
              <input
                type="datetime-local"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleChange}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-text outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5 flex items-center gap-1.5">
                <Clock size={14} /> Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-text outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-muted mb-2 flex items-center gap-1.5">
              <ListChecks size={14} /> Select Problems
            </label>
            <div className="border border-border rounded-lg divide-y divide-border max-h-60 overflow-y-auto">
              {allProblems.map((problem) => (
                <label
                  key={problem._id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-input transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedProblems.includes(problem._id)}
                    onChange={() => toggleProblem(problem._id)}
                  />
                  <span className="text-text text-sm flex-1">{problem.title}</span>
                  <span className="text-muted text-xs">{problem.difficulty}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-white font-bold py-3 rounded-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            Schedule Interview
          </button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleInterviewPage;