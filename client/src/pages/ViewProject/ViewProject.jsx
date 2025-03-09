import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

import Chat from "../Chat/Chat";
import ViewMembers from "../ViewMembers";
import ViewProjectChapters from "./ViewProjectChapters";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ViewProject = () => {
  const { authTokens, user } = useContext(AuthContext);
  const { user_id } = useParams(); // Get user_id from the URL
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(err.response ? err.response.data.error : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [user.user_id, authTokens]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className=" mx-auto px-6 sm:px-24 bg-white  rounded-lg">
        <Header />
      <h2 className="text-xl font-bold mb-4 text-center text-green-600">
        Project Details
      </h2>

      {projectData?.projects.length > 0 ? (
        <div className="">
          <h3 className="text-lg font-semibold">Student Lead:</h3>
          <p>
            <strong>Name:</strong> {projectData.student_lead.first_name}{" "}
            {projectData.student_lead.last_name}
          </p>

          <h3 className="text-xl font-semibold mt-4">Projects:</h3>
          {projectData.projects.map((project) => (
            <div key={project.user_id} className="border p-4 my-2 rounded-lg">
              <p>
                <strong>Title:</strong> {project.title}
              </p>
              <p>
                <strong>Description:</strong> {project.description}
              </p>
            </div>
          ))}

          {/*project chapters */}
          <section className="grid mb-4">
            <ViewProjectChapters studentId={user.studentId} />
            <button className="py-2 px-4 bg-green-600 text-yellow-400 font-semibold ">
              <Link to="/create_project_chapters">Add Project Chapters +</Link>
            </button>
          </section>

          <button className=" text-yellow-800 border border-green-600 fonr-semibold px-8 mx-4 rounded-xl">
            <Link to="/home">homepage...</Link>
          </button>
        </div>
      ) : (
        <p className="text-gray-600 text-center">
          No projects found for this user.
        </p>
      )}

      {/* Project members */}
      <ViewMembers studentId={user.studentId} />

      {/* Chat */}
      <Chat projectData={projectData} UserId={user.user_id} />

      <Footer />
    </div>
  );
};

export default ViewProject;
