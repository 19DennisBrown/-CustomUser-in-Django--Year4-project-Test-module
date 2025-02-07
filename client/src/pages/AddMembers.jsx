





import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const AddMembers = () => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [projectId, setProjectId] = useState('');
    const [studentMembers, setStudentMembers] = useState([{ first_name: '', last_name: '' }]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleProjectIdChange = (e) => setProjectId(e.target.value);

    const handleMemberChange = (index, e) => {
        const { name, value } = e.target;
        const updatedMembers = [...studentMembers];
        updatedMembers[index][name] = value;
        setStudentMembers(updatedMembers);
    };

    const addMemberField = () => {
        setStudentMembers([...studentMembers, { first_name: '', last_name: '' }]);
    };

    const removeMemberField = (index) => {
        setStudentMembers(studentMembers.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/user/projects/${projectId}/add-members/`,
                { student_members: studentMembers },
                { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authTokens?.access}` } }
            );

            if (response.status === 201) {
                setSuccess('Members added successfully!');
                setStudentMembers([{ first_name: '', last_name: '' }]);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                logoutUser();
            } else {
                setError('Error adding members. Please try again.');
            }
            console.error('Error:', err);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Members to Project</h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">Project ID</label>
                    <input
                        type="text"
                        id="projectId"
                        name="projectId"
                        value={projectId}
                        onChange={handleProjectIdChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Student Members</label>
                    {studentMembers.map((member, index) => (
                        <div key={index} className="flex space-x-2 mt-2">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={member.first_name}
                                onChange={(e) => handleMemberChange(index, e)}
                                required
                                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={member.last_name}
                                onChange={(e) => handleMemberChange(index, e)}
                                required
                                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                onClick={() => removeMemberField(index)}
                                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMemberField}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Add Member
                    </button>
                </div>
                <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                    Add Members
                </button>
            </form>
        </div>
    );
};

export default AddMembers;
