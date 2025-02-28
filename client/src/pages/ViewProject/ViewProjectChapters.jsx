





import  { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
import AuthContext from '../../context/AuthContext'; // Import AuthContext for authentication

const ViewProjectChapters = () => {
  const { authTokens, user } = useContext(AuthContext); // Extract auth tokens and user from context
  const { user_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        // Make the GET request to the Django API with the proper Authorization headers
        const response = await axios.get(
          `http://127.0.0.1:8000/chapters/view/${user.user_id}/`, 
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );
        setData(response.data);
        // console.log({"view chapters" : response.data})
      } catch (err) {
        setError(err.response ? err.response.data.error : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [user.user_id, authTokens]);

  if (loading) return <div className="flex justify-center items-center h-screen">
  <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
</div>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white  rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Project Chapters</h2>



      {/* Display project Chapters */}
      {data.chapters && data.chapters.length > 0 ? (
        <ol className="list-none grid gap-4 sm:grid-cols-3 grid-cols-1">
          {data.chapters.map((chapter, index) => (
            <li key={index} className="border p-4 my-2 rounded-lg">
              <p><strong>Name:</strong> {chapter.chapter_name} </p>
              <p><strong>Registeration No:</strong> {chapter.chapter_title}</p>

            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-600">No project Chapters added</p>
      )}

            <button className='py-2 px-4 bg-green-600 text-yellow-400 font-semibold hidden sm:block'>
                            <Link to='/create_project_chapters'>Add Project Chapters + </Link>
            </button>
    </div>
  );
};

export default ViewProjectChapters;
