import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";
import ConfidenceDonut from "../components/ConfidenceDonut";

const Dashboard = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Overall Mastery</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">72%</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Strong Patterns</p>
            <p className="text-3xl font-bold text-green-600 mt-2">5</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Weak Patterns</p>
            <p className="text-3xl font-bold text-red-600 mt-2">3</p>
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

        </div>
      </div>
    </div>
  );
};

export default Dashboard;