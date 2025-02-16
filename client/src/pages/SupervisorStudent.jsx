import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const StudentLeadForSupervisor = () => {
  const { user_id } = useParams();
  const { authTokens, user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentLeads = async () => {
      try {
        const url = `http://127.0.0.1:8000/user/studentleadsupervisor/${user.user_id}/`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setData(response.data);
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || err.message || "An error occurred while fetching data.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentLeads();
  }, [user.user_id, authTokens]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center">
          <p> ..No info found...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-green-600">Student/-Leads List</h2>
      <h3 className="text-2xl font-semibold mt-6">Students</h3>
      {data.students.length === 0 ? (
        <p>No students assigned.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.students.map((student) => (
            <div key={student.user_id} className="border-2 border-gray-300 p-4 rounded-md">
              <h4 className="text-xl font-semibold">
                {student.first_name} {student.last_name}
              </h4>
              <h5 className="text-lg font-semibold mt-2">Projects:</h5>
              {student.projects.length > 0 ? (
                <ul className="list-disc pl-5">
                  {student.projects.map((project, index) => (
                    <li key={index}>
                      <strong>{project.title}</strong>: {project.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No projects assigned.</p>
              )}
              <button className="border-2 rounded-lg border-green-600 text-yellow-600 py-1 px-4 mt-2">
                <Link to={`/onestudentleadforsupervisor/${student.user_id}`}>View more....</Link>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentLeadForSupervisor;
