import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>

        {errors.non_field_errors && (
          <p className="text-red-500 text-center mb-4">{errors.non_field_errors[0]}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <fieldset className="border-2 border-green-600 rounded-md text-center ">
                <legend className="px-2 text-xl font-semibold">Registeration-/Unique Code</legend>
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="CT101-G-100-12"
                    className="w-full py-1 px-3 pb-2 mt-2 text-green-500 font-semibold  border-gray-300 rounded-md focus:outline-none"
                  />
              </fieldset>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>}
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                  <fieldset className="border-2 border-green-600 rounded-md text-center ">
                      <legend className="px-2 text-md font-semibold">Email</legend>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="first.second@kyu.students.co.ke"
                          className="w-full py-1 px-3 pb-2 mt-2   rounded-md focus:outline-none text-green-500 font-semibold"
                        />
                    </fieldset>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
              </div>

              <div>
                  <fieldset className="border-2 border-green-600 rounded-md text-center ">
                      <legend className="px-2 text-md font-semibold">Role</legend>
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
              <fieldset className="border-2 border-green-600 rounded-md text-center ">
                  <legend className="px-2 text-md font-semibold">Password</legend>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full py-1 px-3 pb-2 mt-2 rounded-md text-green-500 font-semibold focus:outline-none "
                    />
                </fieldset>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
          </div>


          <button
            type="submit"
            disabled={loading} // Disable the button while loading
            className={` w-full  py-3  text-white font-semibold  rounded-md   transition 
            ${loading ? 
              'w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin' : 
              'bg-blue-500 hover:bg-blue-600 hover:opacity-80'
            }
          `}
          >
            {loading ? 'Processing...' : 'Register'} {/* Button text change */}
          </button>
        </form>

        <div className="mt-4 text-center text-xl text-green-900">
          Already registered?{" "}
          <Link to="/" className="text-blue-500 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
