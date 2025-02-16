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

    // Register user
    const registerUser = async (e) => {
        e.preventDefault();
        let errorMessage = ''; // Default error message

        const registrationData = {
            username: e.target.username.value.trim(),
            email: e.target.email.value.trim(),
            password: e.target.password.value,
            role: e.target.role.value.trim(),
        };

        // Log the data before sending to API
        console.log("Registering with data:", registrationData);

        let response = await fetch('http://127.0.0.1:8000/user/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData),
        });

        let data = await response.json();

        console.log("Registration response:", data); // Log response to debug

        if (response.status === 201) {
            // Registration is successful, proceed to login
            let loginResponse = await fetch('http://127.0.0.1:8000/user/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value,
                }),
            });

            let loginData = await loginResponse.json();

            if (loginResponse.status === 200) {
                setAuthTokens(loginData);
                setUser(jwtDecode(loginData.access));
                localStorage.setItem('authTokens', JSON.stringify(loginData));
                localStorage.setItem('userRole', loginData.role);
                navigate('/home'); // Navigate after successful login
            } else {
                errorMessage = 'Login failed after registration';
            }
        } else {
            // If registration fails, capture backend errors
            console.log("Registration failed with error:", data);
            errorMessage = data?.non_field_errors?.[0] || 'An error occurred during registration';
        }

        // Return error message for the UI
        return errorMessage;
    };

    // Login user
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
            navigate('/home');
        } else {
            setError('Invalid username or password');
        }
    };

    // Logout user
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('userRole');
        setLoading(false);
        navigate('/');
    };

    // Update token
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
        }, 1000 * 60 * 24); // Refresh every 24 minutes

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser, registerUser }}>
            {loading ? <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
        </div>
         : children}
        </AuthContext.Provider>
    );
};
