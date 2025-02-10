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
    <div className="min-h-screen flex items-center justify-center bg-gray-400 px-2">
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

        <fieldset className="border-2 border-green-600 rounded-md text-center">
            <legend className="px-2  text-xl font-sans">Registeration-/Unique-Code</legend>
            <input
              type="text"
              name="username"
              placeholder="eg. CT101-G-100-12"
              required
              className="w-full p-3 text-lg rounded-md focus:outline-none "
            />
          </fieldset>

        <fieldset className="border-2 border-green-600 rounded-md text-center">
            <legend className="px-2 text-xl">Password</legend>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter Password"
              className="w-full text-left text-lg p-3 rounded-md focus:outline-none "
              />
          </fieldset>

        <section className="grid grid-cols-2 gap-4">
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

            <button className="bg-green-300 font-semibold  text-orange-600  rounded-md "> 
                <Link to='/'> Landing Page </Link>
            </button>
        </section>
      </form>

      <div className="absolute bottom-10 text-center text-2xl text-green-900">
        Not yet registered?{" "}
        <Link to="/register" className="text-blue-500 font-semibold hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
