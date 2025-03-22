import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Sidebar = ({ scrollToSection }) => {
  let { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // State to manage sidebar open/close
  const [isOpen, setIsOpen] = useState(false); // Closed by default (for mobile)

  // Function to toggle sidebar open/close
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Effect to set initial state based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.matchMedia("(min-width: 640px)").matches) {
        setIsOpen(true); // Open sidebar by default on desktop
      } else {
        setIsOpen(false); // Close sidebar by default on mobile
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("userRole"); // Remove role from localStorage
    navigate("/"); // Redirect to landing page after logout
  };

  return (
    <>
      {/* Sidebar Toggle Button (visible on small screens) */}
      <button
        onClick={toggleSidebar}
        className="fixed sm:hidden top-20 left-2 z-50 p-2 bg-gray-800 text-white rounded-md shadow-lg focus:outline-none"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white p-6 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 z-40`}
      >
        {/* Dashboard Title */}
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-4">
            <li>
              <button className="cursor-pointer py-2 text-sm sm:text-md text-white font-semibold">
                <Link to="/profile">Create/Update Profile</Link>
              </button>
            </li>
            <li>
              {user.role === "student" ? (
                <div>
                  <button className="py-2 text-white font-semibold ">
                    <Link to="/create_project">Create/Update Project</Link>
                  </button>
                </div>
              ) : (
                <div></div>
              )}
            </li>
            {user.role === "student" ? (
              <div>
                <button className="py-2 text-white font-semibold ">
                  <Link to="/create_project_chapters">
                    Add Project Chapters +{" "}
                  </Link>
                </button>
              </div>
            ) : (
              <div></div>
            )}
            <li>
              {user.role === "student" ? (
                <div>
                  <button className="py-2 text-white font-semibold ">
                    <Link to="/add_member">Add Project Members + </Link>
                  </button>
                </div>
              ) : (
                <div></div>
              )}
            </li>

            <li>
              <button
                onClick={() => scrollToSection("chat")} // Call scrollToSection here
                className="block w-full text-left hover:bg-gray-700 px-4 py-2 rounded text-white"
              >
                Continue Chatting..
              </button>
            </li>

            <li>
              <p
                onClick={handleLogout}
                className="text-red-500 cursor-pointer hover:underline font-semibold"
              >
                Logout
              </p>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for small screens (click to close sidebar) */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed sm:hidden inset-0 bg-black/50 z-30"
        ></div>
      )}
    </>
  );
};


Sidebar.propTypes = {
    scrollToSection: PropTypes.func.isRequired, // Validate scrollToSection as a required function
  };
  
  export default Sidebar;