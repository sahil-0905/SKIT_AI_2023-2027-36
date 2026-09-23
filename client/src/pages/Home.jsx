import { Link } from "react-router-dom";
import ThreeBackground from "../components/ThreeBackground";

function Home() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const dashboardLink =
    role === "interviewer" ? "/interviewer-dashboard" : "/student-dashboard";

  return (
    <div className="min-h-screen bg-bg">

      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[600px]">
        <ThreeBackground />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-28 pb-20">
          <span className="inline-block bg-accent-soft text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            AI-Powered · Secure · Real-time
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight mb-5">
            Technical interviews,<br /> done right.
          </h1>

          <p className="text-muted text-base md:text-lg max-w-2xl mx-auto mb-10">
            Real-time collaborative coding, live video, and AI-powered code
            review — all in one secure platform for students and
            interviewers.
          </p>

          <div className="flex items-center justify-center gap-4">
            {token ? (
              <Link
                to={dashboardLink}
                className="bg-accent text-white font-bold px-7 py-3 rounded-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-accent text-white font-bold px-7 py-3 rounded-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-panel border border-border text-text font-bold px-7 py-3 rounded-lg"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section - same as before */}
      <div className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-panel border border-border rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center text-accent font-bold mb-4">
              {"</>"}
            </div>
            <h3 className="text-text font-bold mb-2">Live Coding Editor</h3>
            <p className="text-muted text-sm">
              Real-time collaborative editor with multi-language support and
              instant code execution.
            </p>
          </div>

          <div className="bg-panel border border-border rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center text-accent font-bold mb-4">
              🎥
            </div>
            <h3 className="text-text font-bold mb-2">Built-in Video Calls</h3>
            <p className="text-muted text-sm">
              Conduct interviews with live video, audio, and screen sharing —
              no extra tools needed.
            </p>
          </div>

          <div className="bg-panel border border-border rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center text-accent font-bold mb-4">
              ✨
            </div>
            <h3 className="text-text font-bold mb-2">AI Code Review</h3>
            <p className="text-muted text-sm">
              Get AI-assisted feedback on code quality, correctness, and
              complexity after every submission.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;