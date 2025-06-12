import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GoalsPage from "./pages/GoalsPage";
import GoalDetailPage from "./pages/GoalDetailPage";
import TimeLogsPage from "./pages/TimeLogsPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/goal/:goalId" element={<GoalDetailPage />} />
          {/* Redirect dashboard to goals as the new entry point */}
          <Route path="/dashboard" element={<Navigate to="/goals" replace />} />
          <Route path="/timelogs" element={<TimeLogsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
