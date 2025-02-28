import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import loginSvg from "../assets/images/svg/login.svg"

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
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 h-[100vh] bg-white ">
      <div className=" grid items-center gap-4 py-24 justify-center ">
        <form
          onSubmit={handleSubmit}
          className="bg-white  p-8 rounded-lg shadow-2xl w-full sm:w-[35vw]  flex flex-col gap-5"
        >
          <h2 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-4">
            Welcome to WPMS. Login!
          </h2>

          {error && (
            <div className="text-red-600 bg-red-100 p-3 rounded-md text-center">
              {error}
            </div>
          )}

          <fieldset className="border-1 border-green-600 rounded-md text-center">
              <legend className="px-2  text-sm  font-semibold font-sans">Registeration-/Unique-Code</legend>
              <input
                type="text"
                name="username"
                placeholder="eg. CT101-G-100-12"
                required
                className="w-full p-2 text-sm  rounded-md focus:outline-none  text-green-500 font-semibold "
              />
            </fieldset>

          <fieldset className="border-1 border-green-600 rounded-md text-center">
              <legend className="px-2  text-sm  font-semibold">Password</legend>
              <input
                type="password"
                name="password"
                required
                placeholder="Enter Password"
                className="w-full text-left text-sm  p-2 rounded-md  text-green-500 font-semibold focus:outline-none "
                />
            </fieldset>

            <section className="grid">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white font-semibold rounded-md transition flex justify-center items-center ${
                  loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 hover:opacity-80"
                }`}
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-t-2 border-green-500 rounded-full animate-spin mr-2"></span>
                )}
                {loading ? "logging in our user..." : "Login"}
              </button>
            </section>


        </form>

        <div className=" bottom-10 text-center text-sm  text-green-900">
          Not yet registered?{" "}
          <Link to="/register" className="text-blue-500 font-semibold hover:underline hover:text-green-600">
            Register
          </Link>
        </div>
      </div>


                {/* svg section */}
      <div className="hidden sm:flex jutify-center items-center p-19">
        <img src={loginSvg}  alt="login"  className="text-blue-200"/>
      </div>
    </div>
  );
};

export default LoginPage;
