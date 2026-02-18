import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";
import ConfidenceDonut from "../components/ConfidenceDonut";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async() => {
      try {
        const data = await getDashboardStats();
        setStats(data.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load dashboard");
      }finally{
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-10 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-4 gap-6 mt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
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


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <Sidebar />

      <div className="flex-1 overflow-y-auto p-10">

        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Track your learning insights & mastery progress
        </p>

        { /* Stats */ }
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


        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">
              Strongest Patterns
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Sliding Window</span>
                  <span className="text-green-600 font-medium">85%</span>
                </div>
                <ProgressBar value={85} color="bg-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">
              Weak Patterns
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Graph BFS</span>
                  <span className="text-red-600 font-medium">40%</span>
                </div>
                <ProgressBar value={40} color="bg-red-500" />
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

          {/* Confidence Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">
              Confidence Distribution
            </h3>

            <ConfidenceDonut
              data={{
                high: 5,
                medium: 7,
                low: 3,
              }}
            />

            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                High
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                Medium
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                Low
              </div>
            </div>
          </div>
            
          {/* Recent Submissions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">
            <h3 className="text-lg font-semibold mb-6">
              Recent Submissions
            </h3>

            {stats.recentSubmissions.length === 0 ? (
              <p className="text-gray-500">
                No submissions yet. Start solving problems!
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
                        {submission.problem?.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {submission.problem?.difficulty}
                      </p>
                    </div>

                    <span
                      className={`font-semibold ${
                        submission.verdict === "Accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {submission.verdict}
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