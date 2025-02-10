import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const [role, setRole] = useState(localStorage.getItem('userRole') || '');
    const navigate = useNavigate();

    useEffect(() => {
        // If user logs out, clear role from localStorage
        if (!user) {
            localStorage.removeItem('userRole');
            setRole()
            console.log(role)
        }
    }, [user]);

    const handleLogout = () => {
        logoutUser();
        localStorage.removeItem('userRole'); // Remove role from localStorage
        navigate('/'); // Redirect to landing page after logout
    };

    // If the user is not logged in, don't render the header
    if (!user) {
        return null; // Return null so the header is not shown when logged out
    }

    return (
        <div className="flex items-center gap-4 p-4 mb-12 bg-gray-100 shadow-md">
            <Link to="/home" className="text-blue-500 hover:underline font-semibold">Home</Link>
            <span className="text-gray-500">|</span>

            <p
                onClick={handleLogout}
                className="text-red-500 cursor-pointer hover:underline font-semibold"
            >
                Logout
            </p>

            <p className="text-gray-700 font-medium hidden sm:block">Hello, {user.username} </p> <br />
            <p className="text-green-500 font-semibold text-lg mt-2 hidden sm:block">Your Role is: [{user.role}]</p>

        </div>
    );
};

export default Header;
