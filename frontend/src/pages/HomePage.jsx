import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      id: 1,
      title: "Organize with Task Lists",
      description:
        "Create multiple task lists to organize your work by project, priority, or category.",
      icon: "📋",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Track Progress",
      description:
        "Mark tasks as complete and track your productivity with visual progress indicators.",
      icon: "✅",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Detailed Task Management",
      description:
        "Add descriptions, set priorities, and manage task details with our intuitive interface.",
      icon: "📝",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Secure & Personal",
      description:
        "Your tasks are secure with user authentication and personalized workspaces.",
      icon: "🔒",
      color: "bg-indigo-500",
    },
    {
      id: 5,
      title: "Real-time Updates",
      description:
        "Your changes are saved instantly and synced across all your devices.",
      icon: "⚡",
      color: "bg-yellow-500",
    },
    {
      id: 6,
      title: "Clean Interface",
      description:
        "Focus on what matters with our distraction-free, modern design.",
      icon: "🎨",
      color: "bg-pink-500",
    },
  ];

  const stats = [
    { label: "Task Lists", value: "Unlimited", icon: "📊" },
    { label: "Tasks per List", value: "No Limit", icon: "📈" },
    { label: "Users Active", value: "Growing", icon: "👥" },
    { label: "Uptime", value: "99.9%", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📋</span>
              <h1 className="text-2xl font-bold text-gray-900">TaskBoard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize Your Tasks,
            <span className="block text-indigo-600">
              Boost Your Productivity
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The simple yet powerful task management solution that helps you stay
            organized, track progress, and accomplish your goals efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Stay Organized
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make task management simple and
            effective
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built for Scale</h2>
            <p className="text-gray-300">Our platform grows with your needs</p>
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

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Create Account
            </h3>
            <p className="text-gray-600">
              Sign up for free and access your personal dashboard
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Create Task Lists
            </h3>
            <p className="text-gray-600">
              Organize your work by creating custom task lists
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Manage Tasks
            </h3>
            <p className="text-gray-600">
              Add, edit, and track your tasks to boost productivity
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Organized?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of users who have transformed their productivity with
            TaskBoard
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl">📋</span>
              <span className="text-xl font-bold">TaskBoard</span>
            </div>
            <div className="text-gray-400">
              © 2025 TaskBoard. Built with React & Node.js
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
