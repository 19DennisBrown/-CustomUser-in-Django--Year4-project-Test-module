import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import projectsvg from "../assets/images/svg/project.svg"; // Import the SVG file

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [role, setRole] = useState(localStorage.getItem("userRole") || "");
  const navigate = useNavigate();

  useEffect(() => {
    // If user logs out, clear role from localStorage
    if (!user) {
      localStorage.removeItem("userRole");
      setRole();
      console.log(role);
    }
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("userRole"); // Remove role from localStorage
    navigate("/"); // Redirect to landing page after logout
  };

  // If the user is not logged in, don't render the header
  if (!user) {
    return null; // Return null so the header is not shown when logged out
  }

  return (
    <div className="flex items-center justify-between gap-2 p-4 mb-12 bg-gray-100 shadow-md">
      <section className="grid grid-cols-2">
        <Link to="/home" className="flex items-center">
          {/* Replace "Home" text with the SVG image */}
          <img src={projectsvg} alt="Projects" className="h-8 w-8" />
        </Link>

        <p className="text-gray-700 font-medium hidden sm:block">
          Hello, <span className="text-green-800">{user.role}👋🏾 </span>{" "}
        </p>
      </section>
      <section className="grid grid-cols-1 gap-2 items-center">
        <p
          onClick={handleLogout}
          className="text-red-500 cursor-pointer hover:underline font-semibold"
        >
          logout
        </p>

        {/* <div className="bg-blue-300 border-2 border-green-900 rounded-[50%] h-10 w-10 "></div> */}
      </section>
    </div>
  );
};

export default Header;