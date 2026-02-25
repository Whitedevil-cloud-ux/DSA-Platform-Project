import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";
import ConfidenceDonut from "../components/ConfidenceDonut";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import { getConfidenceAnalytics } from "../services/analyticsService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [patternMastery, setPatternMastery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confidenceData, setConfidenceData] = useState({
    high: 0,
    medium: 0,
    low: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dashboardRes, confidenceRes] = await Promise.all([
          getDashboardStats(),
          getConfidenceAnalytics(),
        ]);

        const dashboardData = dashboardRes.data;
        const confidenceData = confidenceRes.data;

        setStats(dashboardData);
        setPatternMastery(dashboardData.patternMastery || []);
        setConfidenceData(confidenceData);
        // const response = await getDashboardStats();
        // const data = response.data;

        // setStats(data);
        // setPatternMastery(data.patternMastery || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-10">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const strongest = stats?.strongestPattern;
  const weakest = stats?.weakestPattern;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-10">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Track your learning insights & mastery progress
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Total Submissions</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {stats.totalSubmissions}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Correct Submissions</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.correctSubmissions}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Accuracy</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.accuracy}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Problems Solved</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.problemsSolved}
            </p>
          </div>
        </div>

        {/* Pattern Mastery Overview */}
        {patternMastery.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm mt-10">
            <h2 className="text-xl font-semibold mb-6">
              Pattern Mastery Overview
            </h2>

            <div className="space-y-6">
              {patternMastery.map((item, index) => {
                const score = item.masteryScore || 0;

                let barColor = "bg-red-500";
                let label = "Weak";

                if (score >= 70) {
                  barColor = "bg-green-500";
                  label = "Strong";
                } else if (score >= 40) {
                  barColor = "bg-yellow-500";
                  label = "Improving";
                }

                return (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">
                        {item.pattern}
                      </span>
                      <span className="text-sm text-gray-600">
                        {score}% • {label}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 h-3 rounded-full">
                      <div
                        className={`${barColor} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      Accuracy: {Math.round(item.accuracy * 100)}% •
                      Solved: {item.problemsSolved}/{item.problemsAttempted}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Strongest & Weakest */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

          {strongest && (
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold mb-6">
                Strongest Pattern
              </h3>

              <div>
                <div className="flex justify-between mb-2">
                  <span>{strongest.pattern}</span>
                  <span className="text-green-600 font-medium">
                    {strongest.masteryScore}%
                  </span>
                </div>

                <ProgressBar
                  value={strongest.masteryScore}
                  color="bg-green-500"
                />
              </div>
            </div>
          )}

          {weakest && (
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold mb-6">
                Weakest Pattern
              </h3>

              <div>
                <div className="flex justify-between mb-2">
                  <span>{weakest.pattern}</span>
                  <span className="text-red-600 font-medium">
                    {weakest.masteryScore}%
                  </span>
                </div>

                <ProgressBar
                  value={weakest.masteryScore}
                  color="bg-red-500"
                />
              </div>
            </div>
          )}

        </div>

        {/* Recommended Focus */}
        {stats.focusPattern && (
          <div className="bg-indigo-50 p-6 rounded-2xl shadow-sm mt-10 border border-indigo-100">
            <h3 className="text-lg font-semibold mb-2 text-indigo-700">Recommended Focus</h3>
            <p className="text-gray-700">
              Focus on{" "}
              <span className="font-semibold text-indigo-600">
                {stats.focusPattern.pattern}
              </span>{" "}
              - low mastery & high interview importance.
            </p>
            <div className="mt-4 text-sm text-gray-600">
              Mastery: {stats.focusPattern.masteryScore} % . 
              Interview Weight: {stats.focusPattern.interviewWeight}
            </div>

            <button
            onClick={() => navigate(`/problems/?pattern=${encodeURIComponent(stats.focusPattern.pattern)}`)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
              Practice Now →
            </button>
          </div>
        )}

        {/* Confidence + Recent */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">
              Confidence Distribution
            </h3>

            <ConfidenceDonut data={confidenceData} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">
              Recent Submissions
            </h3>

            {stats.recentSubmissions.length === 0 ? (
              <p className="text-gray-500">
                No submissions yet.
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentSubmissions.map((submission) => (
                  <div
                    key={submission._id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">
                        {submission.problemId?.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {submission.problemId?.difficulty}
                      </p>
                    </div>

                    <span
                      className={`font-semibold ${
                        submission.isCorrect
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {submission.isCorrect ? "AC" : "WA"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;