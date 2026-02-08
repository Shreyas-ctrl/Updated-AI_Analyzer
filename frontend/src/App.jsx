import { useState, useRef } from "react";
import "./App.css";
import Hologram from "./components/Hologram";
import Particles from "./components/Particles";

const STEP_TITLES = [
  "Uploading Resume",
  "Parsing Content",
  "Analyzing Skills",
  "Generating Suggestions",
];

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const [dragging, setDragging] = useState(false);
  const [sphereOffset, setSphereOffset] = useState({ x: 0, y: 0 });
  const sphereRef = useRef(null);

  const validateFile = (f) => {
    if (!f) return "";
    if (!f.type.includes("pdf")) return "❌ Only PDF files allowed";
    if (f.size > 5 * 1024 * 1024) return "❌ File size must be under 5MB";
    return "";
  };

  const handleFileSelect = (f) => {
    const err = validateFile(f);
    setValidationError(err);
    if (!err) setFile(f);
  };

  const handleMouseMove = (e) => {
    if (!sphereRef.current) return;
    const rect = sphereRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.1;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.1;
    console.log("handleMouseMove ->", { x, y });
    setSphereOffset({ x, y });
  };



  const analyzeResume = async () => {
  try {
    setLoading(true);
    setError(null);
    setValidationError("");

    setStep("Uploading Resume");
    setProgress(20);

    const formData = new FormData();
    formData.append("resume", file);

    setStep("Parsing Content");
    setProgress(35);

    const response = await fetch("https://resumeanalyzer-backend1.onrender.com/analyze-resume", {
      method: "POST",
      body: formData,
    });

    setStep("Analyzing Skills");
    setProgress(60);

    if (!response.ok) {
      throw new Error("Failed to analyze resume");
    }

    const data = await response.json();

    setStep("Generating Suggestions");
    setProgress(90);

    setResult(data);
    setProgress(100);
    setStep("Complete!");
  } catch (err) {
    setError(err.message);
  } finally {
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
      setStep("");
    }, 1000);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white overflow-hidden">
      <Particles />
      
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <div className="relative bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/10 shadow-2xl">
          {/* Sphere positioned above heading */}
          <div ref={sphereRef} className="flex justify-center mb-8 h-48" onMouseMove={handleMouseMove}>
            <div>
              <Hologram offset={sphereOffset} />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-center mb-2 text-white">
            AI Resume Analyzer
          </h1>
          <p className="text-center text-gray-300 mb-8">
            Career guidance powered by multi-agent AI
          </p>

        <div className="flex flex-col items-center gap-0">
          {!file ? (
            <label
              className={`border-2 border-dashed border-cyan-500/30 rounded-xl p-7 text-center cursor-pointer transition-all duration-300 max-w-sm w-full mb-5 bg-gradient-to-br from-cyan-500/3 to-blue-500/3 ${
                dragging
                  ? "bg-cyan-500/15 border-cyan-400 shadow-glow-cyan-lg scale-105"
                  : "hover:bg-cyan-500/6 hover:border-cyan-400 hover:shadow-glow-cyan hover:scale-103 hover:shadow-lg hover:-translate-y-0.5"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFileSelect(e.dataTransfer.files[0]);
              }}
            >
              <div className="text-5xl mb-4 animate-float">📄</div>
              <div className="text-lg font-semibold bg-gradient-to-r from-cyan-100 to-cyan-300 bg-clip-text text-transparent mb-1">
                Drag & drop your resume here
              </div>
              <div className="text-sm opacity-65">or click to select (PDF, max 5MB)</div>
              <input
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </label>
          ) : (
            <div className="flex items-center gap-4 bg-gradient-to-br from-cyan-500/6 to-blue-500/4 border border-cyan-500/15 rounded-xl p-4 mb-5 max-w-sm w-full backdrop-blur-sm animate-in slide-in-from-top duration-300">
              <div className="text-3xl flex-shrink-0">📄</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-cyan-100 truncate text-sm">
                  {file.name}
                </div>
                <div className="text-xs opacity-70 mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <button
                className="flex-shrink-0 bg-red-500/20 border border-red-500/40 text-red-300 px-2 py-1.5 rounded-md cursor-pointer transition-all duration-200 hover:bg-red-500/30 hover:border-red-500/60 hover:scale-110"
                onClick={() => {
                  setFile(null);
                  setValidationError("");
                }}
              >
                ✕
              </button>
            </div>
          )}

          {validationError && (
            <div className="text-red-300 text-sm mb-2 p-2.5 px-3 bg-red-500/10 border-l-4 border-red-300 rounded-sm max-w-sm w-full animate-in slide-in-from-top duration-300">
              {validationError}
            </div>
          )}
          {error && (
            <div className="text-red-400 text-sm mb-2 p-2.5 px-3 bg-red-600/10 border-l-4 border-red-400 rounded-sm max-w-sm w-full animate-in slide-in-from-top duration-300">
              {error}
            </div>
          )}

          <button
            onClick={analyzeResume}
            disabled={!file || loading}
            className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold py-2.5 px-8 rounded-lg cursor-pointer mt-6 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:enabled:shadow-2xl"
          >
            {loading ? `${step}...` : "Analyze Resume"}
          </button>

          {loading && (
            <>
              <div className="flex justify-between gap-2 mt-8 mb-4 max-w-md w-full px-2">
                {STEP_TITLES.map((title, idx) => {
                  const activeStep =
                    progress < 25 ? 0 : progress < 50 ? 1 : progress < 80 ? 2 : 3;
                  const isComplete = idx < activeStep;
                  const isActive = idx === activeStep;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                          isComplete
                            ? "bg-green-500/30 border-2 border-green-400 text-green-300"
                            : isActive
                            ? "bg-cyan-500/30 border-2 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30"
                            : "bg-white/8 border-2 border-cyan-500/20 text-white/50"
                        }`}
                      >
                        {isComplete ? "✓" : isActive ? "⏳" : idx + 1}
                      </div>
                      <div
                        className={`text-xs text-center transition-all duration-300 ${
                          isActive
                            ? "text-cyan-100 font-semibold opacity-100"
                            : isComplete
                            ? "text-green-300 opacity-80"
                            : "text-gray-400 opacity-50"
                        }`}
                      >
                        {title}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="w-full max-w-md bg-white/8 rounded-full overflow-hidden h-4 shadow-inner border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-500 shadow-lg animate-progress-pulse"
                  style={{ width: `${progress}%`, backgroundSize: "200% 100%" }}
                ></div>
              </div>
            </>
          )}

          {result && (
            <>
              <div className="mt-8 pt-8 border-t border-white/20">
                <h3 className="text-lg font-semibold mb-3 text-white">Career Readiness</h3>
                <p className="text-2xl font-bold text-cyan-300">
                  {result.job_readiness_score}% job-ready
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-white">Recommended Roles</h3>
                {result.recommended_roles.map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 mb-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-gray-100">{r.role}</span>
                    <strong className="text-cyan-300 font-semibold">
                      {Math.round(r.match_score * 100)}%
                    </strong>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-white">Skill Gaps</h3>
                <div className="flex flex-wrap gap-2">
                  {result.skill_gaps.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-block bg-gradient-to-br from-cyan-500/8 to-blue-500/4 border border-cyan-500/18 text-cyan-100 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm hover:border-cyan-400/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-white">Learning Path</h3>
                <ul className="space-y-2">
                  {result.learning_path.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-cyan-400 font-bold flex-shrink-0 mt-0.5">
                        {i + 1}.
                      </span>
                      <span className="text-gray-100">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <h3 className="text-lg font-semibold mb-3 text-white">
                  Want a Detailed Learning Roadmap?
                </h3>
                <p className="text-gray-300 mb-4">
                  Get a personalized, in-depth learning plan delivered to your
                  email.
                </p>
                <a
                  href="https://docs.google.com/forms/d/1y5hf6HwBofEJKZyr8P0dkxHfWmllGE1JfySdInWXgmc/preview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Get Detailed Learning Path via Email
                </a>
              </div>
            </>
          )}
        </div>
        </div>

        <footer className="mt-16 pt-6 border-t border-white/20 text-center">
          <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
            This tool is an AI-powered career guidance system designed to analyze resumes
            against generalized role expectations. It currently works best for commonly
            observed professional roles and skill sets. The insights provided are for
            learning, self-improvement, and career exploration only and do not represent
            hiring decisions or professional evaluations.
          </p>
        </footer>
      </div>
    </div>
  );
}


