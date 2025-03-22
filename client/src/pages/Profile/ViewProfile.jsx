import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import AuthContext from "../../context/AuthContext"; // Import AuthContext
import { useContext } from "react"; // Import useContext
import axios from "axios"; // Import axios for API calls
import { FaUserGraduate } from "react-icons/fa6";

const ViewProfile = () => {
  const [showProfile, setShowProfile] = useState(false); // State to toggle profile view
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [loading, setLoading] = useState(false); // State for loading spinner
  const { authTokens, user } = useContext(AuthContext); // Get user info and tokens from AuthContext

  // Fetch profile data based on user role
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      let url = "";
      if (user.role === "supervisor") {
        url = `http://localhost:8000/user/onesupervisor/${user.user_id}/`;
      } else if (user.role === "student") {
        url = `http://localhost:8000/user/onestudentlead/${user.user_id}/`;
      } else {
        setLoading(false);
        return;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle profile view
  const toggleProfile = () => {
    if (!showProfile) {
      fetchProfileData(); // Fetch data only when opening the profile view
    }
    setShowProfile(!showProfile);
  };

  return (
    <>
      {/* Navbar */}
      <div className="z-10 text-white mt-4">
        {/* Desktop Navigation */}
        <ul className="hidden md:flex justify-end items-center">
          {/* Circular View Profile Button */}
          <li
            className="bg-gray-500 border-1 border-green-600 rounded-[50%] h-10 w-10 flex justify-center items-center cursor-pointer hover:bg-blue-400 transition-colors duration-300"
            onClick={toggleProfile}
          >
            <span className="text-2xl font-semibold text-black">
              <FaUserGraduate />
            </span>
          </li>
        </ul>

        {/* Mobile Navigation Icon */}
        <div
          className="block md:hidden bg-blue-300 border-2 border-green-900 rounded-[50%] h-10 w-10 flex justify-center items-center cursor-pointer hover:bg-blue-400 transition-colors duration-300"
          onClick={toggleProfile}
        >
          <FaUserGraduate />
        </div>
      </div>

      {/* Profile Overlay */}
      {showProfile && (
        <div className="fixed inset-0 bg-gray-300/80 px-6  flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-red-600 font-bold hover:text-gray-900"
              onClick={toggleProfile}
            >
              <AiOutlineClose size={20} />
            </button>

            {/* Loading Spinner */}
            {loading && (
              <div className="flex justify-center items-center h-32">
                <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
              </div>
            )}

            {/* Profile Data */}
            {!loading && profileData && (
              <>
                <h2 className="text-3xl font-semibold mb-6 text-center text-green-600">
                  {user.role === "supervisor"
                    ? "Supervisor Information"
                    : "Student Lead Information"}
                </h2>

                {/* Supervisor Information */}
                {user.role === "supervisor" && (
                  <>
                    <h3 className="text-xl font-semibold my-4">
                      {profileData.first_name || "No first name"}{" "}
                      {profileData.last_name || "No last name"}
                    </h3>

                    <section className="grid sm:grid-cols-2 grid-cols-1 gap-4 my-4">
                      <p className="text-gray-600 border-1 font-semibold px-4 py-2 rounded-md border-green-600">
                        Department: {profileData.department || "N/A"}
                      </p>
                      <p className="text-gray-600 border-1 font-semibold px-4 py-2 rounded-md border-green-600">
                        Username: {user.username}
                      </p>
                    </section>

                    <fieldset className="border-1 border-green-600 p-4 rounded-lg">
                      <legend className="text-lg font-semibold text-gray-700 px-2">
                        Email:
                      </legend>
                      <p className="text-black font-semibold">
                        {profileData.user.email || "N/A"}
                      </p>
                    </fieldset>
                  </>
                )}

                {/* Student Lead Information */}
                {user.role === "student" && (
                  <>
                    <h3 className="text-xl font-semibold">
                      {profileData.student_lead.first_name || "No first name"}{" "}
                      {profileData.student_lead.last_name || "No last name"}
                    </h3>

                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                      <p className="text-gray-900 border border-green-300 p-2">
                        <span className="font-semibold">Programme</span>:{" "}
                        {profileData.student_lead.programme || "N/A"}
                      </p>
                      <p className="text-gray-900 border border-green-300 p-2">
                        <span className="font-semibold">Supervisor</span>:{" "}
                        {profileData?.student_lead?.supervisor
                          ? `${profileData.student_lead.supervisor.first_name} ${profileData.student_lead.supervisor.last_name}`
                          : "N/A"}
                      </p>
                    </section>

                    <p className="text-gray-600 my-4">
                      <span className="font-semibold">Username</span>:{" "}
                      {user.username}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Email</span>:{" "}
                      {profileData.student_lead.user.email || "N/A"}
                    </p>
                  </>
                )}
              </>
            )}

            {/* No Data Message */}
            {!loading && !profileData && (
              <p className="text-center text-gray-500">
                No profile data available or data is incomplete.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewProfile;