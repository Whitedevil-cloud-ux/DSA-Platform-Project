import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:slug" element={<ProblemDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;