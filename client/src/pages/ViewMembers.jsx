





// ViewMembers.jsx
import  { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import AuthContext from '../context/AuthContext'; // Import AuthContext for authentication

const ViewMembers = () => {
  const { authTokens, user } = useContext(AuthContext); // Extract auth tokens and user from context
  const { user_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Make the GET request to the Django API with the proper Authorization headers
        const response = await axios.get(
          `http://127.0.0.1:8000/user/view_members/${user.user_id}/`, 
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

    fetchMembers();
  }, [user.user_id, authTokens]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white  rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Project Collaborative Members</h2>

      {/* Display student lead details */}
      <div className="mb-6">
        {/* <h3 className="text-xl font-semibold">Student Lead:</h3>
        <p><strong>Name:</strong> {data.student_lead.first_name} {data.student_lead.last_name}</p> */}
        {/* <p><strong>Email:</strong> {data.student_lead.user.email}</p> */}
      </div>

      {/* Display project members */}
      {data.members && data.members.length > 0 ? (
        <ol className="list-none">
          {data.members.map((member) => (
            <li key={member.user_id} className="border p-4 my-2 rounded-lg">
              <p><strong>Name:</strong> {member.first_name} {member.last_name}</p>
              <p><strong>Email:</strong> {member.user.email}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-600">No project members found</p>
      )}
    </div>
  );
};

export default ViewMembers;
