import { submitProblem, getProblemSubmissions, updateConfidence } from "../services/submissionService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemBySlug } from "../services/problemService";
import Sidebar from "../components/Sidebar";

const ProblemDetail = () => {
  const { slug } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submitting, setSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastSubmissionId, setLastSubmissionId] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblemBySlug(slug);
        setProblem(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [slug]);

  useEffect(() => {
    if(!problem) return;
    const fetchHistory = async() => {
        try {
            const data = await getProblemSubmissions(problem._id);
            setHistory(data.data);
        } catch (error) {
            console.error(error);
        }
    };
    fetchHistory();
  }, [problem]);

  const handleSubmit = async () => {
  if (submitting) return;
  if (!code.trim()) {
    alert("Please write some code before submitting.");
    return;
  }

  try {
    setSubmitting(true);

    const response = await submitProblem({
      problemId: problem._id,
      isCorrect: Math.random() > 0.5,
      difficulty: problem.difficulty,
      language,
    });

    const submission = response?.data?.submission;

    if (submission) {
      setLastSubmissionId(submission._id);
      setVerdict(submission.isCorrect ? "Accepted" : "Wrong Answer");
    }

    const updatedHistory = await getProblemSubmissions(problem._id);
    setHistory(updatedHistory.data);

  } catch (error) {
    console.error(error);
    if (error.response?.status === 429) {
      alert("Please wait before submitting again.");
    } else {
      alert(error.response?.data?.message || "Submission failed");
    }
  } finally {
    setSubmitting(false);
  }
};

    const handleConfidence = async(level) => {
        if(!lastSubmissionId) return;
        try{
            await updateConfidence(lastSubmissionId, level);
            console.log("Last submission id: ", lastSubmissionId);
            alert("Confidence recorded");
        }catch(error) {
            console.error(error);
        }
    };


  if (loading) return <div className="p-10">Loading problem...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10 overflow-y-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold">{problem.title}</h1>

        <div className="flex items-center gap-4 mt-4">
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
                Interview Frequency: {problem.interviewFrequency}
            </span>
        </div>

        {/* Patterns */}
        <div className="mt-6 flex flex-wrap gap-2">
            {problem.patterns?.map((pattern) => (
            <span
                key={pattern._id}
                className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full"
            >
                {pattern.name}
            </span>
            ))}
        </div>

        {/* Description */}
        <div className="mt-8 text-gray-700 whitespace-pre-line">
            {problem.description}
        </div>

        {/* Approaches Section */}
        {problem.approaches?.length > 0 && (
            <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">
                Approaches
            </h2>

            <div className="space-y-6">
                {problem.approaches.map((approach, index) => (
                <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-2">
                    {approach.title}
                    </h3>

                    <p className="text-gray-700 mb-4 whitespace-pre-line">
                    {approach.explanation}
                    </p>

                    <div className="flex gap-6 text-sm text-gray-600">
                    <span>
                         Time: {approach.timeComplexity}
                    </span>
                    <span>
                         Space: {approach.spaceComplexity}
                    </span>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        {/* External Link */}
        {problem.externalLink && (
            <div className="mt-8">
            <a
                href={problem.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline font-medium"
            >
                View Original Problem →
            </a>
            </div>
        )}

        {/* Code Editor Section */}
        <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">
            Code Editor
            </h2>
            <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mb-4 px-3 py-2 border rounded-lg"
            >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            </select>

            <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your solution here..."
            className="w-full h-64 p-4 border rounded-lg font-mono text-sm"
            ></textarea>

            <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
            {submitting ? "Submitting..." : "Submit"}
            </button>

            {verdict && (
            <div className="mt-4 font-semibold text-lg">
                Verdict:{" "}
                <span
                className={
                    verdict === "Accepted"
                    ? "text-green-600"
                    : "text-red-600"
                }
                >
                {verdict}
                </span>
            </div>
            )}

            {verdict && (
            <div className="mt-6">
                <h3 className="font-semibold mb-3">
                How confident are you with this problem?
                </h3>

                <div className="flex gap-4">
                {["High", "Medium", "Low"].map((level) => (
                    <button
                    key={level}
                    onClick={() => handleConfidence(level)}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                    >
                    {level}
                    </button>
                ))}
                </div>
            </div>
            )}

            {history.length > 0 && (
                <div className="mt-10 bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Submission History</h3>
                    <div className="space-y-2 text-sm">
                        {history.map((item, index) => (
                            <div key={index} className="flex justify-between border-b pb-2">
                                <span>{new Date(item.createdAt).toLocaleString()}</span>
                                <span className={
                                    item.isCorrect ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                                }>{item.isCorrect ? "AC" : "WA"}</span>
                                <span className="text-gray-600">{item.language}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>

        </div>

    </div>
  );
};

export default ProblemDetail;
