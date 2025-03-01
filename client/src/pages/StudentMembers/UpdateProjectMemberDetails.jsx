

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const UpdateMemberForm = () => {
  const { authTokens } = useContext(AuthContext);
  const { member_id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({
    first_name: '',
    last_name: '',
    admision_no: '',
    programme: '',
    mail: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:8000/members/update/${member_id}/`,
        member,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      navigate('/home'); // Redirect to the members list
    } catch (err) {
      setError(err.response ? err.response.data.error : 'An error occurred');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
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
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="first_name"
            value={member.first_name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={member.last_name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Admission No</label>
          <input
            type="text"
            name="admision_no"
            value={member.admision_no}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Programme</label>
          <input
            type="text"
            name="programme"
            value={member.programme}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="mail"
            value={member.mail}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Save Changes
          </button>


          <button
            type="button"
            onClick={() => navigate('/home')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMemberForm;