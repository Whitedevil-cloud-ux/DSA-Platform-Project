import { useEffect, useState } from "react";
import { getAllProblems } from "../services/problemService";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const recommendedPattern = queryParams.get("pattern");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getAllProblems();
        setProblems(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) return <div className="p-10">Loading problems...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  const filteredProblems = recommendedPattern
    ? problems.filter((problem) => 
      problem.patterns?.some(
        (pattern) => pattern.name === recommendedPattern
      )
    )
    : problems;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Problems</h1>

        {recommendedPattern && (
          <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg mb-6">
            Showing recommended patttern: {recommendedPattern}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <div
              key={problem._id}
              onClick={() => navigate(`/problems/${problem.slug}`)}
              className="bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">
                {problem.title}
              </h2>

              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    problem.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {problem.difficulty}
                </span>

                <span className="text-sm text-gray-500">
                  {problem.interviewFrequency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Problems;
