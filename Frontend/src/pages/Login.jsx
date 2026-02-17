import authImage from "../assets/auth-illustration.svg";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white items-center justify-center overflow-hidden">

        <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-lg text-center px-12">

            <div className="animate-float">
            <img
                src={authImage}
                alt="Programming Illustration"
                className="w-80 mx-auto drop-shadow-2xl"
            />
            </div>

            <h1 className="text-4xl font-bold mt-10">
            DSA Platform
            </h1>

            <p className="mt-4 text-lg opacity-90 leading-relaxed">
            Master data structures & algorithms with intelligent insights.
            </p>

        </div>
    </div>

      {/* Right Form Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Welcome Back 
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium">
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;