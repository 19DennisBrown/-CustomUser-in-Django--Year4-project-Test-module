import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        // Retrieve authTokens from localStorage if they exist
        const savedTokens = localStorage.getItem('authTokens');
        return savedTokens ? JSON.parse(savedTokens) : null;
    });
    
    const [user, setUser] = useState(() => {
        try {
            // Retrieve and decode the stored JWT token from localStorage to set user info
            const savedTokens = localStorage.getItem('authTokens');
            if (savedTokens) {
                return jwtDecode(JSON.parse(savedTokens).access);
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Login User
    const loginUser = async (e, setError) => {
        e.preventDefault();
        let response = await fetch('http://127.0.0.1:8000/user/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value
            })
        });

        let data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data)); // Store tokens in localStorage
            localStorage.setItem('userRole', data.role); // Store role in localStorage
            navigate('/');
        } else {
            setError('Invalid username or password');
        }
    };

    // Logout User
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('userRole');
        setLoading(false);
        navigate('/login');
    };

    // Update Token
    const updateToken = async () => {
        if (!authTokens?.refresh) {
            logoutUser();
            setLoading(false);
            return;
        }

        try {
            let response = await fetch('http://127.0.0.1:8000/user/token/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: authTokens.refresh }),
            });

            if (response.status === 200) {
                let data = await response.json();
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data)); // Store updated tokens in localStorage
            } else {
                logoutUser();
            }
        } catch (error) {
            console.error("Failed to refresh token:", error);
            logoutUser();
        }

        setLoading(false);
    };

    // Effect to check if user is logged in on page load
    useEffect(() => {
        if (!authTokens) {
            setLoading(false); // No token? Stop loading
            return;
        }

        updateToken(); // Only run once on mount to check token expiration

        let interval = setInterval(() => {
            setAuthTokens((prevTokens) => {
                if (!prevTokens) return null; // Prevent running if no tokens exist
                updateToken();
                return prevTokens;
            });
        }, 1000 * 60 * 4); // Refresh every 4 minutes

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};
