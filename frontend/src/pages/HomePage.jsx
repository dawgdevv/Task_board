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
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Create Action Plans",
      description:
        "Break down goals into manageable action plans and track your progress step by step.",
      icon: "📋",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Manage Tasks Efficiently",
      description:
        "Organize tasks within action plans, mark completions, and stay focused on what matters.",
      icon: "✅",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Track Your Journey",
      description:
        "Visualize progress, monitor deadlines, and celebrate achievements as you reach your goals.",
      icon: "📈",
      color: "bg-indigo-500",
    },
  ];

  const stats = [
    { label: "Goals Achieved", value: "1000+", icon: "🏆" },
    { label: "Action Plans", value: "Unlimited", icon: "📊" },
    { label: "Users Growing", value: "Daily", icon: "👥" },
    { label: "Success Rate", value: "95%", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mr-4">🎯</div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                GoalFlow
              </h1>
              <p className="text-lg text-indigo-600 font-medium">
                Turn Dreams into Achievements
              </p>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Journey from
            <span className="block text-indigo-600"> Goals to Success </span>
          </h2>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
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
              className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Sign In
            </button>
          </div>

          {/* Value Proposition */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Set Goals</h3>
                <p className="text-gray-600 text-sm">
                  Define what you want to achieve
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Plan Actions</h3>
                <p className="text-gray-600 text-sm">
                  Break it down into manageable steps
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Achieve Success
                </h3>
                <p className="text-gray-600 text-sm">
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Achieve Your Goals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A complete ecosystem designed to turn your aspirations into
            accomplishments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How GoalFlow Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to transform your dreams into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Define Your Goals
              </h3>
              <p className="text-gray-600">
                Set clear, specific goals with deadlines and priorities. Whether
                it's career advancement, health improvements, or personal
                projects - start with clarity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Create Action Plans
              </h3>
              <p className="text-gray-600">
                Break down each goal into actionable plans. Create task lists,
                set milestones, and organize your approach systematically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Track & Achieve
              </h3>
              <p className="text-gray-600">
                Execute your tasks, monitor progress, and adjust as needed.
                Celebrate milestones and watch your goals become achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Join the Success Community
            </h2>
            <p className="text-gray-300">
              Real people achieving real results with GoalFlow
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-indigo-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            What Our Users Say
          </h2>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-4xl mb-6">💬</div>
            <blockquote className="text-xl text-gray-700 mb-6 italic">
              "GoalFlow transformed how I approach my objectives. Instead of
              having vague aspirations, I now have clear action plans that
              actually get me to my goals. It's like having a personal success
              coach in my pocket!"
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                S
              </div>
              <div>
                <div className="font-bold text-gray-900">Sarah Chen</div>
                <div className="text-gray-600">Entrepreneur & Life Coach</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands who've turned their dreams into achievements with
            GoalFlow. Your future self will thank you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Your Success Journey
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Already Have an Account?
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
