


import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

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
          `http://127.0.0.1:8000/members/view_one_member/${member_id}/`,
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
        `http://127.0.0.1:8000/members/delete/${member_id}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      // Redirect to the members list after deletion
      navigate('/view_members');
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Member Details</h2>
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

          <div className="flex gap-4 mt-6">
                {/* update button */}
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Edit Member
            </button>

            {/* delete button */}
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Delete Member
            </button>

            {/* Exit button */}
            <Link
              to="/view_members"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Back to Members
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No member details found.</p>
      )}
    </div>
  );
};

export default ViewOneMemberDetails;