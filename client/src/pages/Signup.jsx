import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Code2,
  User,
  Mail,
  Lock,
  GraduationCap,
  Briefcase,
} from "lucide-react";

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:8080/api/auth/signup", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="bg-panel border border-border rounded-2xl p-10 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-purple-400 flex items-center justify-center text-white font-bold shadow-lg shadow-accent/20">
            {"</>"}
          </div>
          <span className="font-bold text-text">
            AI-Powered Coding Platform
          </span>
        </div>

        <h2 className="text-xl font-bold text-center text-text mb-1">
          Create your account
        </h2>
        <p className="text-sm text-muted text-center mb-6">
          Start your coding interview journey
        </p>

        {error && (
          <div className="bg-red/15 text-red text-sm rounded-lg px-4 py-2.5 mb-4 text-center border border-red/20">
            {error}
          </div>
        )}

        <div className="flex bg-input border border-border rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "student" })}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-semibold transition-all ${
              formData.role === "student"
                ? "bg-accent text-white shadow-md"
                : "text-muted"
            }`}
          >
            <GraduationCap size={15} /> Student
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "interviewer" })}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-semibold transition-all ${
              formData.role === "interviewer"
                ? "bg-accent text-white shadow-md"
                : "text-muted"
            }`}
          >
            <Briefcase size={15} /> Interviewer
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-muted mb-1.5">Full Name</label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Sahil Kumar"
                className="w-full bg-input border border-border rounded-lg pl-10 pr-3 py-2.5 text-text outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-muted mb-1.5">Email</label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-input border border-border rounded-lg pl-10 pr-3 py-2.5 text-text outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-muted mb-1.5">Password</label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-input border border-border rounded-lg pl-10 pr-3 py-2.5 text-text outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-white font-bold py-3 rounded-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
          >
            <Code2 size={16} /> Create Account
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
