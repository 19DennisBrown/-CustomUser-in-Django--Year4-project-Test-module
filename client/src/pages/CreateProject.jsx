import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from "../components/Header"

const CreateProject = () => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const url = "http://localhost:8000/user/create_project/"
    axios
    .post(url, formData, {
        headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "application/json",
        },
    })
    .then(() => {
        // alert("project created successfully!");
        navigate("/home");
    })
    .catch((error) => {
        console.error(
            "Error creating project:",
            error.response ? error.response.data : error
        );
        console.log(
            `Error: ${
                error.response
                    ? JSON.stringify(error.response.data)
                    : "Unknown error"
            }`
        );
    });

    
    setLoading(false);
  };

  const handleCancel = () => navigate("/home");

  return (
    <div className="w-full mx-auto  p-6 bg-white shadow-lg rounded-lg">
      <Header />
    <h2 className="text-2xl font-semibold mb-20">Create a New Project or Update Details</h2>
    {error && <p className="text-red-500 mb-4">{error}</p>}


    <form onSubmit={handleSubmit} className="sm:px-16 px-4">
        <fieldset className="border-1 border-black  mb-4 rounded-md text-left">
            <legend className="px-2 mx-4  text-sm   font-sans">Project Title</legend>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 focus:outline-none"
                  placeholder="eg, Web-based project manager"
                  required
                />
          </fieldset>


          <fieldset className="border-1 border-black rounded-md mb-10 text-left">
            <legend className="px-2 mx-4   text-sm  font-sans">Project Description</legend>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 focus:outline-none"
              required
            ></textarea>
          </fieldset>

                {/* Buttons */}
                <div className="flex space-x-4 ">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-2  text-green-900 font-semibold rounded-md transition flex justify-center items-center ${
                        loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 hover:opacity-80"
                      }`}
                    >
                      {loading && (
                        <span className="w-4 h-4 border-2 border-t-2 border-green-600 rounded-full animate-spin mr-2"></span>
                      )}
                      {loading ? "creating project..." : "create project"}
                    </button>

                    {/* cancel */}
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="w-full py-2 font-semibold border border-gray-600 text-blue-900 rounded-md hover:bg-gray-700"
                  >
                      Cancel
                  </button>
              </div>
    </form>
  </div>
  );
};

export default CreateProject;
