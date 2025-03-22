import { useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";

import Header from "../components/Header";
import SupervisorStudent from "./SupervisorStudent";
import ViewProject from "./ViewProject/ViewProject";
import Footer from "../components/Footer";
import ViewProfile from "./Profile/ViewProfile";
import Sidebar from "../components/Sidebar"; 

const HomePage = () => {
  let { user } = useContext(AuthContext);
  
  // Create refs for each section
  const chatRef = useRef(null);

  // Function to scroll to a specific section
  const scrollToSection = (section) => {
    switch (section) {
      case "chat":
        chatRef.current.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar scrollToSection={scrollToSection} /> {/* Pass scrollToSection as a prop */}

      {/* Main Content */}
      <div className="flex-1 p-2 overflow-y-auto sm:ml-64">
        <section className="grid grid-cols-8 gap-1">
          <div className="grid col-span-7">
            <Header />
          </div>

          <div className="grid col-span-1">
            <ViewProfile />
          </div>
        </section>

        {/* Student details for student view */}
        <section className="mt-8" ref={chatRef}>
          {user.role === "student" ? <ViewProject /> : <> </>}
        </section>

        <section className="mt-8">
          {user.role === "supervisor" ? (
            <SupervisorStudent supervisorId={user.supervisorId} />
          ) : (
            <div></div>
          )}
        </section>

        <hr className="border-t-3 my-4 border-green-500" />

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;