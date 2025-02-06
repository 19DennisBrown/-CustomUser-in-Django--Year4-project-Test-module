import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const ProfileView = () => {
  const { authTokens, user } = useContext(AuthContext); // Get user info and tokens from AuthContext
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    let url = "";
    
    // Determine API endpoint based on user role
    if (user.role === "supervisor") {
      url = "http://127.0.0.1:8000/user/supervisors/";
    } else if (user.role === "student") {
      url = "http://127.0.0.1:8000/user/studentleads/";
    } else {
      setLoading(false);
      return;
    }

    // Fetch user data based on role
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((response) => {
        setProfileData(response.data);
        setLoading(false); // Stop loading when data is retrieved
        console.log(response.data); // Debugging: Log API response
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, [user.role, authTokens]);

  // Show a loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        {user.role === "supervisor" ? "Supervisor Information" : "Student Information"}
      </h2>

      {profileData && profileData.length > 0 ? (
        <div>
          {profileData.map((profile) => (
            <div key={profile.id} className="mb-4 p-4 border border-gray-300 rounded-md hover:shadow-lg">
              <h3 className="text-xl font-semibold">
                {profile.first_name || "No first name"} {profile.last_name || "No last name"}
              </h3>
              {user.role === "supervisor" && (
                <>
                  <p className="text-gray-600">Department: {profile.department || "N/A"}</p>
                </>
              )}
              {user.role === "student" && (
                <>
                  <p className="text-gray-600">First Name: {profile.first_name || "N/A"}</p>
                  <p className="text-gray-600">Second Name: {profile.last_name || "N/A"}</p>
                  <p className="text-gray-600">Programme: {profile.programme || "N/A"}</p>
                  <p className="text-gray-600">Supervisor: {profile.supervisor?.first_name || "N/A"} {profile.supervisor?.last_name || ""}</p>
                </>
              )}
              <p className="text-gray-600">Username: {user.username}</p>
              <p className="text-gray-600">Email: {profile.email || "N/A"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No profile data available or data is incomplete.</p>
      )}
    </div>
  );
};

export default ProfileView;
