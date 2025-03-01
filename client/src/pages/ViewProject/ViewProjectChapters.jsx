import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';

const ViewProjectChapters = () => {
  const { authTokens, user } = useContext(AuthContext);
  const { user_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch chapters on component mount
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/chapters/view/${user.user_id}/`, 
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );
        setData(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [user.user_id, authTokens]);



  // Handle view operation
  const handleView = (chapter_id) => {
    navigate(`/view_project_chapter/${chapter_id}`); // Navigate to the details page
  };

  // Loading state
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
    </div>
  );

  // Error state
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Project Chapters</h2>

      {data.chapters && data.chapters.length > 0 ? (
        <ol className="list-none grid gap-4 sm:grid-cols-3 grid-cols-1">
          {data.chapters.map((chapter, index) => (
            <li key={index} className="border p-4 my-2 rounded-lg">
              <p><strong>Name/number:</strong> {chapter.chapter_name}</p>
              <p><strong>Chapter Title:</strong> {chapter.chapter_title}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleView(chapter.id)}
                >
                  View details
                </button>

              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-600">No project chapters added</p>
      )}

      <button className='py-2 px-4 bg-green-600 text-yellow-400 font-semibold hidden sm:block'>
        <Link to='/create_project_chapters'>Add Project Chapters +</Link>
      </button>
    </div>
  );
};

export default ViewProjectChapters;