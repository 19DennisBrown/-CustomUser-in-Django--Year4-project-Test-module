


import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const ViewProjectChapterDetails = () => {
  const { authTokens } = useContext(AuthContext);
  const { chapter_id } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch chapter details on component mount
  useEffect(() => {
    const fetchChapterDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/chapters/one_chapter/view/${chapter_id}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );
        setChapter(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChapterDetails();
  }, [chapter_id, authTokens]);

  // Handle delete operation
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/chapters/delete/${chapter_id}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      // Redirect to the chapters list after deletion
      navigate('/home');
    } catch (err) {
      setError(err.response ? err.response.data.error : 'An error occurred');
    }
  };

  // Handle edit operation
  const handleEdit = () => {
    navigate(`/edit_project_chapter/${chapter_id}`); // Navigate to the edit page
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
      <h2 className="text-xl font-bold mb-4 text-center">Chapter Details</h2>
      {chapter ? (
        <div className="space-y-4">
          <p><strong>Name:</strong> {chapter.chapter_name}</p>
          <p><strong>Title:</strong> {chapter.chapter_title}</p>
          <p><strong>Date Created:</strong> {new Date(chapter.date_created).toLocaleDateString()}</p>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>

          <Link to="/home" className="text-blue-500 underline">
            Exit
          </Link>
        </div>
      ) : (
        <p className="text-gray-600">No chapter details found.</p>
      )}
    </div>
  );
};

export default ViewProjectChapterDetails;