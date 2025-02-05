import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitting

    const responseError = await loginUser(e, setError);

    if (responseError) {
      setError(responseError);
    }

    setLoading(false); // Reset loading state after submission
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Login
        </h2>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Enter Password"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="submit"
          value={loading ? "" : "Login"} // Change button text to "Processing..." when loading
          disabled={loading} // Disable the button while loading
          className={`
            w-full 
            py-3 
            text-white 
            font-semibold 
            rounded-md 
            transition 
            ${loading ? 
              'w-4 h-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin' : 
              'bg-blue-500 hover:bg-blue-600 hover:opacity-80'
            }
          `}
        />
      </form>

      <div className="absolute bottom-10 text-center text-gray-700">
        Not yet registered?{" "}
        <Link to="/register" className="text-blue-500 font-semibold hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
