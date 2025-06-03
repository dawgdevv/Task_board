import { useState, useEffect } from "react";

const ProfileIcon = () => {
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomProfileImage();
  }, []);

  const fetchRandomProfileImage = async () => {
    try {
      const randomId = Math.floor(Math.random() * 1000);
      const response = await fetch(`https://picsum.photos/id/${randomId}/info`);

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.download_url);
      } else {
        // Fallback to direct image URL if info endpoint fails
        setProfileImage(`https://picsum.photos/50/50?random=${randomId}`);
      }
    } catch (error) {
      // Fallback profile image
      console.error("Error fetching profile image:", error);
      setProfileImage(
        `https://picsum.photos/50/50?random=${Math.floor(Math.random() * 1000)}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
    );
  }

  return (
    <img
      src={profileImage}
      alt="Profile"
      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
      onError={(e) => {
        e.target.src = `https://picsum.photos/50/50?random=${Math.floor(
          Math.random() * 1000
        )}`;
      }}
    />
  );
};

export default ProfileIcon;
