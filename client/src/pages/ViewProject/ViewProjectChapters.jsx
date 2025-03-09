import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";

const ViewProjectChapters = ({ studentUserId }) => {
  const { authTokens, user } = useContext(AuthContext);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/chapters/files_list/${user.role === 'student' ? user.user_id : studentUserId}/`,
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
  }, [studentUserId, authTokens]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
      </div>
    );

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-2 sm:p-6 my-4">
      <h1 className="text-xl font-bold text-center mb-8">Project Chapters Files</h1>

      {projectData && projectData.length > 0 ? (
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
          {projectData.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white p-6 rounded-lg shadow-md mb-6"
            >
              <h2 className="text-xl font-semibold mb-2">
                {chapter.chapter_name}
              </h2>
              <p className="text-gray-600 mb-4">{chapter.name}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Uploaded at: {new Date(chapter.uploaded_at).toLocaleString()}
                </p>
                <a
                  href={chapter.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Download
                </a>
              </div>

              {user.role === 'student' ? 
              <Link
              to={`/view_project_detail/${chapter.id}`}
              className="mt-4 bg-orange-500 text-white px-4 py-1 rounded hover:bg-red-600 w-full block text-center"
              >
                View and delete
              </Link>
                : <div> </div>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No chapters uploaded yet.</p>
      )}
    </div>
  );
};

export default ViewProjectChapters;