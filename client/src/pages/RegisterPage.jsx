import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import loginSvg from "../assets/images/svg/register.svg"

const RegisterPage = () => {
  const { registerUser } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setLoading(true); // Set loading state to true when form is submitting

    const responseErrors = await registerUser(e);
    
    if (responseErrors) {
      setErrors(responseErrors); // Set validation errors from backend
    }

    setLoading(false); // Reset loading state after submission
  };

  return (
    <div className=" bg-gray-00 w-full grid grid-cols-1 sm:grid-cols-2 h-[100vh] ">

          <div className="grid items-center gap-4 py-16 justify-center ">


            <form onSubmit={handleSubmit} className="p-8 rounded-lg shadow-2xl w-full sm:w-[35vw]  flex flex-col gap-5">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
              Signup to WPMS. Register!
            </h2>

            {errors.non_field_errors && (
              <p className="text-red-500 text-center mb-4">{errors.non_field_errors[0]}</p>
            )}

              <div>
                <fieldset className="border-1 border-green-600 rounded-md text-center ">
                    <legend className="px-2  text-sm  font-semibold">Registeration-/Unique Code</legend>
                      <input
                        type="text"
                        name="username"
                        required
                        placeholder="CT101-G-100-12"
                        className="w-full p-2 text-sm  text-green-500 font-semibold  border-gray-300 rounded-md focus:outline-none"
                      />
                  </fieldset>
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>}
              </div>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                      <fieldset className="border-1 border-green-600 rounded-md text-center ">
                          <legend className="px-2  text-sm  font-semibold">Email</legend>
                            <input
                              type="email"
                              name="email"
                              required
                              placeholder="first.second@kyu.students.co.ke"
                              className="w-full p-2 text-sm  px-3 pb-2 mt-2   rounded-md focus:outline-none text-green-500 font-semibold"
                            />
                        </fieldset>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                  </div>

                  <div>
                      <fieldset className="border-1 border-green-600 rounded-md text-center ">
                          <legend className="px-2  text-sm  font-semibold">Role</legend>
                            <select
                              name="role"
                              required
                              className="w-full py-1 px-3 pb-2 mt-2   rounded-md focus:outline-none text-green-500 font-semibold "
                            >
                              <option value="student" className="text-green-500 font-semibold">Student</option>
                              <option value="supervisor "  className="text-green-500 font-semibold">Supervisor</option>
                            </select>
                        </fieldset>
                  </div>
              </section>

              <div>
                  <fieldset className="border-1 border-green-600 rounded-md text-center ">
                      <legend className="px-2  text-sm  font-semibold">Password</legend>
                        <input
                          type="password"
                          name="password"
                          required
                          className="w-full p-2 text-sm  py-1 px-3 pb-2 mt-2 rounded-md text-green-500 font-semibold focus:outline-none "
                        />
                    </fieldset>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
              </div>


              <section className="grid">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 text-white font-semibold rounded-md transition flex justify-center items-center ${
                    loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 hover:opacity-80"
                  }`}
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-t-2 border-green-600 rounded-full animate-spin mr-2"></span>
                  )}
                  {loading ? "Registering new user..." : "Register"}
                </button>
              </section>

            </form>

            <div className="mt-4 text-center text-sm text-green-900">
              Already registered?{" "}
              <Link to="/" className="text-blue-500 font-semibold hover:underline hover:text-green-600">
                Login
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

export default RegisterPage;
