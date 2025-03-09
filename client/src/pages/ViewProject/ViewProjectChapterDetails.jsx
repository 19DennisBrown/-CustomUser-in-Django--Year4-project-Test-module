import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Header from '../../components/Header'

const ViewProjectChapterDetails = () => {
  const { fileId } = useParams(); // Get the fileId from the URL
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null); // State to store chapter details
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch chapter details when the component mounts
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/chapters/files/${fileId}/`,
          {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }
        );
        setChapter(response.data); // Set the chapter details
      } catch (err) {
        setError(err.response ? err.response.data.error : "An error occurred");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchChapter();
  }, [fileId, authTokens]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>

        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Chapter not found.</p>
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Header />
      <h1 className="text-3xl font-bold text-center mb-8">Chapter Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">{chapter.chapter_name}</h2>
        <p className="text-gray-600 mb-4">{chapter.name}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Uploaded at: {new Date(chapter.uploaded_at).toLocaleString()}
          </p>
          <a
            href={chapter.file}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download
          </a>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <button
            onClick={() => navigate(`/chapters_delete/${chapter.id}`)} 
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Delete
          </button>

          
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
          >
            Go Back
          </button>
        </section>
      </div>
    </div>
  );
};

export default ViewProjectChapterDetails;
