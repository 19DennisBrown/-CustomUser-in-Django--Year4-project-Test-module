



import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const ViewProject = () => {
    const { authTokens, user } = useContext(AuthContext);
    const { user_id } = useParams(); // Get user_id from the URL
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/user/view_project/${user.user_id}/`,
                    {
                        headers: { Authorization: `Bearer ${authTokens.access}` },
                    }
                );
                setProjectData(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.error : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [user.user_id, authTokens]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Project Details</h2>

            {projectData?.projects.length > 0 ? (
                <div>
                    <h3 className="text-xl font-semibold">Student Lead:</h3>
                    <p><strong>Name:</strong> {projectData.student_lead.first_name} {projectData.student_lead.last_name}</p>

                    <h3 className="text-xl font-semibold mt-4">Projects:</h3>
                    {projectData.projects.map((project) => (
                        <div key={project.user_id} className="border p-4 my-2 rounded-lg">
                            <p><strong>Title:</strong> {project.title}</p>
                            <p><strong>Description:</strong> {project.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center">No projects found for this user.</p>
            )}
        </div>
    );
};

export default ViewProject;
