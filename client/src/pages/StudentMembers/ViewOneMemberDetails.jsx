


import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Header from "../../components/Header"

const ViewOneMemberDetails = () => {
  const { authTokens } = useContext(AuthContext);
  const { member_id } = useParams(); // Get member_id from the URL
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch member details on component mount
  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/members/view_one_member/${member_id}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );
        setMember(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [member_id, authTokens]);

  // Handle delete operation
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/members/delete/${member_id}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      // Redirect to the members list after deletion
      navigate('/home');
    } catch (err) {
      setError(err.response ? err.response.data.error : 'An error occurred');
    }
  };

  // Handle edit operation
  const handleEdit = () => {
    navigate(`/edit_member_details/${member_id}`); // Navigate to the update form
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
    <div className="w-full text-center mx-1 sm:mx-auto p-1 bg-white rounded-lg shadow-md">
      <Header/>
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Project Member Details</h2>
      {member ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>First Name:</strong> {member.first_name}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>Last Name:</strong> {member.last_name}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>Admission No:</strong> {member.admision_no}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>Programme:</strong> {member.programme}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>Email:</strong> {member.mail}</p>
          </div>

          <div className="flex gap-4 mt-8 justify-center">
                {/* update button */}
            <button
              onClick={handleEdit}
              className="border border-blue-500 text-green-600 px-4  rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Edit..
            </button>

            {/* delete button */}
            <button
              onClick={handleDelete}
              className="border border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Delete..
            </button>

            {/* Exit button */}
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-500 text-grey-800 px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No member details found.</p>
      )}
    </div>
  );
};

export default ViewOneMemberDetails;