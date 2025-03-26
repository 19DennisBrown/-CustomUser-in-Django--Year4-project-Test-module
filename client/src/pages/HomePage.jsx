import { useContext, useRef, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

import Header from "../components/Header";
import SupervisorStudent from "./SupervisorStudent";
import ViewProject from "./ViewProject/ViewProject";
import Footer from "../components/Footer";
import ViewProfile from "./Profile/ViewProfile";
import Sidebar from "../components/Sidebar";
import Chat from "../pages/Chat/Chat";

const HomePage = () => {
  let { authTokens, user } = useContext(AuthContext);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create refs for each section
  const chatRef = useRef(null);
  const headerRef = useRef(null);
  const projectRef = useRef(null);

  // State to manage sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to scroll to a specific section
  const scrollToSection = (section) => {
    switch (section) {
      case "chat":
        if (chatRef.current) {
          chatRef.current.scrollIntoView({ behavior: "smooth" });
        }
        break;
      case "header":
        if (headerRef.current) {
          headerRef.current.scrollIntoView({ behavior: "smooth" });
        }
        break;
      case "project":
        if (projectRef.current) {
          projectRef.current.scrollIntoView({ behavior: "smooth" });
        }
        break;
      default:
        break;
    }
  };

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/view_project/${user.user_id}/`,
          {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }
        );
        setProjectData(response.data);
      } catch (err) {
        err
        setError("Create profile to view more...");
      } finally {
        setLoading(false);
      }
    };

    if (user.role === "student") {
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [user.user_id, authTokens, user.role]);

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
      </div>
    );

  // Error state
  if (error) return <p className="text-center text-gray-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        scrollToSection={scrollToSection}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-1 p-2 overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "sm:ml-64" : "sm:ml-0"
        }`}
      >
        {/* Header and Profile Section */}
        <section className="grid grid-cols-8 gap-1" ref={headerRef}>
          <div className="col-span-7">
            <Header />
          </div>
          <div className="col-span-1">
            <ViewProfile />
          </div>
        </section>

        {/* STUDENT PROJECT SECTION */}
        <section className="mt-8" ref={projectRef}>
          {user.role === "student" ? <ViewProject /> : null}
        </section>

        {/* THIS IS THE CHAT SECTION MODULE */}
        <section className="mt-8" ref={chatRef}>
          {user.role === "student" ? (
            <Chat projectData={projectData} UserId={user.user_id} />
          ) : null}
        </section>

        {/* Supervisor Section */}
        <section className="mt-8">
          {user.role === "supervisor" ? (
            <SupervisorStudent supervisorId={user.supervisorId} />
          ) : null}
        </section>

        {/* Footer */}
        <hr className="border-t-3 my-4 border-green-500" />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;