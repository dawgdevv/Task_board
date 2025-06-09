import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      id: 1,
      title: "Set Meaningful Goals",
      description:
        "Define your long-term objectives with detailed descriptions, deadlines, and priority levels.",
      icon: "🎯",
      color: "bg-blue-600",
    },
    {
      id: 2,
      title: "Create Action Plans",
      description:
        "Break down goals into manageable action plans and track your progress step by step.",
      icon: "📋",
      color: "bg-green-600",
    },
    {
      id: 3,
      title: "Manage Tasks Efficiently",
      description:
        "Organize tasks within action plans, mark completions, and stay focused on what matters.",
      icon: "✅",
      color: "bg-purple-600",
    },
    {
      id: 4,
      title: "Track Your Journey",
      description:
        "Visualize progress, monitor deadlines, and celebrate achievements as you reach your goals.",
      icon: "📈",
      color: "bg-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mr-4">🎯</div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                GoalFlow
              </h1>
              <p className="text-lg text-indigo-400 font-medium">
                Turn Dreams into Achievements
              </p>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Journey from
            <span className="block text-indigo-400"> Goals to Success </span>
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The complete goal achievement platform that helps you set meaningful
            objectives, create actionable plans, and track your progress every
            step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate("/signup")}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Start Your Journey Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border-2 border-indigo-600 text-indigo-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-900/20 transition-colors"
            >
              Sign In
            </button>
          </div>

          {/* Value Proposition */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-bold text-white mb-2">Set Goals</h3>
                <p className="text-gray-400 text-sm">
                  Define what you want to achieve
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-bold text-white mb-2">Plan Actions</h3>
                <p className="text-gray-400 text-sm">
                  Break it down into manageable steps
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="font-bold text-white mb-2">Achieve Success</h3>
                <p className="text-gray-400 text-sm">
                  Track progress and celebrate wins
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Achieve Your Goals
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            A complete ecosystem designed to turn your aspirations into
            accomplishments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:shadow-xl hover:border-gray-600 transition-all duration-300 cursor-pointer ${
                hoveredFeature === feature.id ? "transform scale-105" : ""
              }`}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-800 border-y border-gray-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How GoalFlow Works
            </h2>
            <p className="text-lg text-gray-300">
              Simple steps to transform your dreams into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Define Your Goals
              </h3>
              <p className="text-gray-300">
                Set clear, specific goals with deadlines and priorities. Whether
                it's career advancement, health improvements, or personal
                projects - start with clarity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Create Action Plans
              </h3>
              <p className="text-gray-300">
                Break down each goal into actionable plans. Create task lists,
                set milestones, and organize your approach systematically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Track & Achieve
              </h3>
              <p className="text-gray-300">
                Execute your tasks, monitor progress, and adjust as needed.
                Celebrate milestones and watch your goals become achievements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
