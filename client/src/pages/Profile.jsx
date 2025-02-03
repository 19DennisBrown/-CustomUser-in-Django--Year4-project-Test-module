import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { authTokens, user } = useContext(AuthContext);
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        department: '', // Supervisor only
        supervisor: '', // Student Lead only
    });

    const navigate = useNavigate();

    const API_URL = user.role === 'supervisor' 
        ? "http://127.0.0.1:8000/user/create-profile/"
        : "http://127.0.0.1:8000/user/create-profile/";

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!authTokens) {
            navigate('/login');
            return;
        }

        axios.post(API_URL, profile, {
            headers: {
                'Authorization': `Bearer ${authTokens.access}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            alert('Profile created successfully!');
            navigate('/');  // Redirect to the main page or wherever you'd like
        })
        .catch(error => {
            console.error('Error creating profile:', error);
            alert('Error occurred while creating profile.');
        });
    };

    const handleCancel = () => {
        navigate('/');  // Navigate to the homepage
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Create Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="first_name">
                        First Name:
                    </label>
                    <input
                        type="text"
                        name="first_name"
                        value={profile.first_name}
                        onChange={handleChange}
                        id="first_name"
                        className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="last_name">
                        Last Name:
                    </label>
                    <input
                        type="text"
                        name="last_name"
                        value={profile.last_name}
                        onChange={handleChange}
                        id="last_name"
                        className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {user.role === 'supervisor' && (
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700" htmlFor="department">
                            Department:
                        </label>
                        <input
                            type="text"
                            name="department"
                            value={profile.department}
                            onChange={handleChange}
                            id="department"
                            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {user.role === 'student' && (
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700" htmlFor="supervisor">
                            Supervisor ID:
                        </label>
                        <input
                            type="text"
                            name="supervisor"
                            value={profile.supervisor}
                            onChange={handleChange}
                            id="supervisor"
                            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                <div className="flex space-x-4">
                    <button 
                        type="submit"
                        className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Create Profile
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="w-full py-2 mt-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
