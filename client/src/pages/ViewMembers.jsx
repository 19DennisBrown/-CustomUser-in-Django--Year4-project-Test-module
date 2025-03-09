





// ViewMembers.jsx
import  { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext'; // Import AuthContext for authentication

const ViewMembers = () => {
  const { authTokens, user } = useContext(AuthContext); // Extract auth tokens and user from context
  const { user_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Make the GET request to the Django API with the proper Authorization headers
        const response = await axios.get(
          `http://localhost:8000/members/view/${user.user_id}/`, 
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );
        setData(response.data);
        // console.log({"view members" : response.data})
      } catch (err) {
        setError(err.response ? err.response.data.error : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [user.user_id, authTokens]);

  if (loading) return <div className="flex justify-center items-center h-screen">
  <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
</div>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;



  // redirection
    // Handle view operation
    const handleView = (member_id) => {
      navigate(`/one_member_details/${member_id}`); // Navigate to the details page
    };


  return (
    <div className="w-full  mx-1 sm:mx-auto p-1 sm:p-8 bg-white  rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Project Collaborative Members</h2>

      {/* Display student lead details */}
      <div className="mb-6">
        {/* <h3 className="text-xl font-semibold">Student Lead:</h3>
        <p><strong>Name:</strong> {data.student_lead.first_name} {data.student_lead.last_name}</p> */}
        {/* <p><strong>Email:</strong> {data.student_lead.user.email}</p> */}
      </div>

      {/* Display project members */}
      {data.members && data.members.length > 0 ? (
        <ol className="list-none grid gap-4 sm:grid-cols-3 grid-cols-1">
          {data.members.map((member, index) => (
            <li key={index} className="border p-4 my-2 rounded-lg">
              <p><strong>Name:</strong> {member.first_name} {member.last_name}</p>
              <p><strong>Registeration No:</strong> {member.admision_no}</p>
              <p><strong>Programme:</strong> {member.programme}</p>
              <p><strong>Personal Email:</strong> {member.mail || ''}</p>
              <p><strong>Group Email:</strong> {member.user.email}</p>


              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleView(member.id)}
                >
                  View details
                </button>

              </div>

            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-600">No project members found</p>
      )}

            <button className='py-2 px-4 bg-green-600 text-yellow-400 font-semibold hidden sm:block'>
                            <Link to='/add_member'>Add Project Members + </Link>
            </button>
    </div>
  );
};

export default ViewMembers;
