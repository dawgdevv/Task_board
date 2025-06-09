import { useMemo } from "react";

// Utility to get initials from a name or email
function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "U";
  const parts = nameOrEmail.split(" ");
  if (parts.length === 1) {
    // Try to use first letter of email/username
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const ProfileIcon = ({ user }) => {
  // Try to get user info from props or localStorage
  const userData =
    user ||
    (() => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    })();

  const initials = useMemo(
    () => getInitials(userData?.name || userData?.email || ""),
    [userData]
  );

  // Optionally, you can use a static color or generate one based on user/email
  const bgColor = "bg-indigo-600";

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-gray-300 ${bgColor}`}
      title={userData?.name || userData?.email || "User"}
    >
      {initials}
    </div>
  );
};

export default ProfileIcon;
