





import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const ProjectCreation = () => {
    const { authTokens } = useContext(AuthContext);
    const [project, setProject] = useState({
        title: "",
        description: ""
    });
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authTokens) {
            navigate("/login");
            return;
        }

        const requestData = {
            title: project.title,
            description: project.description
        };

        try {
            await axios.post("http://127.0.0.1:8000/user/create_project/", requestData, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                    "Content-Type": "application/json"
                }
            });
            navigate("/");
        } catch (error) {
            console.error("Error creating project:", error.response ? error.response.data : error);
        }
    };

    const handleCancel = () => navigate("/");

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Create a Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="title">
                        Project Title:
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={project.title}
                        onChange={handleChange}
                        id="title"
                        className="mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="description">
                        Description:
                    </label>
                    <textarea
                        name="description"
                        value={project.description}
                        onChange={handleChange}
                        id="description"
                        className="mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Create Project
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="w-full py-2 mt-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectCreation;
