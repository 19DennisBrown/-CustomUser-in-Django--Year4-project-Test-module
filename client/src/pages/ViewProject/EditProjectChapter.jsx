



import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const EditProjectChapter = () => {
  const { authTokens } = useContext(AuthContext);
  const { chapter_id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState({ chapter_name: '', chapter_title: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch chapter details on component mount
  useEffect(() => {
    const fetchChapter = async () => {
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

    fetchChapter();
  }, [chapter_id, authTokens]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:8000/chapters/update/${chapter_id}/`,
        chapter,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      navigate('/home'); // Redirect to the chapters list
    } catch (err) {
      setError(err.response ? err.response.data.error : 'An error occurred');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setChapter({ ...chapter, [e.target.name]: e.target.value });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
    </div>
  );

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Project Chapter</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Chapter Name</label>
          <input
            type="text"
            name="chapter_name"
            value={chapter.chapter_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Chapter Title</label>
          <input
            type="text"
            name="chapter_title"
            value={chapter.chapter_title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProjectChapter;