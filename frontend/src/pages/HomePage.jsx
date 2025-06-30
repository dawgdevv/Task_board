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
      color: "bg-[var(--ctp-sky)]", // Updated
    },
    {
      id: 2,
      title: "Create Action Plans",
      description:
        "Break down goals into manageable action plans and track your progress step by step.",
      icon: "📋",
      color: "bg-[var(--ctp-green)]", // Updated
    },
    {
      id: 3,
      title: "Manage Tasks Efficiently",
      description:
        "Organize tasks within action plans, mark completions, and stay focused on what matters.",
      icon: "✅",
      color: "bg-[var(--ctp-yellow)]", // Updated, avoiding purple
    },
    {
      id: 4,
      title: "Track Your Journey",
      description:
        "Visualize progress, monitor deadlines, and celebrate achievements as you reach your goals.",
      icon: "📈",
      color: "bg-[var(--ctp-peach)]", // Updated, avoiding indigo
    },
  ];

  return (
    // The body already has bg-[var(--ctp-base)] from index.css
    // If a specific section needed a different base, we'd apply it here.
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mr-4">🎯</div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-[var(--ctp-text)]">
                Taskly
              </h1>
              <p className="text-lg text-[var(--ctp-peach)] font-medium">
                Turn Dreams into Achievements
              </p>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[var(--ctp-text)] mb-6">
            Your Journey from
            <span className="block text-[var(--ctp-peach)]">
              {" "}
              Goals to Success{" "}
            </span>
          </h2>

          <p className="text-xl text-[var(--ctp-subtext0)] mb-8 max-w-3xl mx-auto">
            The complete goal achievement platform that helps you set meaningful
            objectives, create actionable plans, and track your progress every
            step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate("/signup")}
              className="button-primary px-8 py-4 text-lg font-semibold shadow-lg"
            >
              Start Your Journey Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="button-base border-2 border-[var(--ctp-peach)] text-[var(--ctp-peach)] px-8 py-4 text-lg font-semibold hover:bg-[var(--ctp-peach)] hover:text-[var(--ctp-base)] transition-colors"
            >
              Sign In
            </button>
          </div>

          {/* Value Proposition */}
          <div className="bg-[var(--ctp-mantle)] border border-[var(--ctp-surface1)] rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[var(--ctp-surface0)] rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-[var(--ctp-peach)]">🎯</span>
                </div>
                <h3 className="font-bold text-[var(--ctp-text)] mb-2">
                  Set Goals
                </h3>
                <p className="text-[var(--ctp-subtext1)] text-sm">
                  Define what you want to achieve
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[var(--ctp-surface0)] rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-[var(--ctp-green)]">📋</span>
                </div>
                <h3 className="font-bold text-[var(--ctp-text)] mb-2">
                  Plan Actions
                </h3>
                <p className="text-[var(--ctp-subtext1)] text-sm">
                  Break it down into manageable steps
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[var(--ctp-surface0)] rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-[var(--ctp-yellow)]">🏆</span>
                </div>
                <h3 className="font-bold text-[var(--ctp-text)] mb-2">
                  Achieve Success
                </h3>
                <p className="text-[var(--ctp-subtext1)] text-sm">
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
          <h2 className="text-4xl font-bold text-[var(--ctp-text)] mb-4">
            Everything You Need to Achieve Your Goals
          </h2>
          <p className="text-lg text-[var(--ctp-subtext0)] max-w-2xl mx-auto">
            A complete ecosystem designed to turn your aspirations into
            accomplishments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`p-6 bg-[var(--ctp-mantle)] border border-[var(--ctp-surface1)] rounded-xl shadow-lg hover:shadow-xl hover:border-[var(--ctp-surface2)] transition-all duration-300 cursor-pointer ${
                hoveredFeature === feature.id ? "transform scale-105" : ""
              }`}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-[var(--ctp-base)] text-2xl mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[var(--ctp-text)] mb-2">
                {feature.title}
              </h3>
              <p className="text-[var(--ctp-subtext0)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[var(--ctp-mantle)] border-y border-[var(--ctp-surface1)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--ctp-text)] mb-4">
              How Taskly Works
            </h2>
            <p className="text-lg text-[var(--ctp-subtext0)]">
              Simple steps to transform your dreams into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--ctp-peach)] text-[var(--ctp-base)] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-[var(--ctp-text)] mb-4">
                Define Your Goals
              </h3>
              <p className="text-[var(--ctp-subtext0)]">
                Set clear, specific goals with deadlines and priorities. Whether
                it's career advancement, health improvements, or personal
                projects - start with clarity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--ctp-green)] text-[var(--ctp-base)] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-[var(--ctp-text)] mb-4">
                Create Action Plans
              </h3>
              <p className="text-[var(--ctp-subtext0)]">
                Break down each goal into actionable plans. Create task lists,
                set milestones, and organize your approach systematically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--ctp-yellow)] text-[var(--ctp-base)] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-[var(--ctp-text)] mb-4">
                Track & Achieve
              </h3>
              <p className="text-[var(--ctp-subtext0)]">
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
