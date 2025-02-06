import { useContext, useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import AuthContext from "../context/AuthContext";
import { useParams } from "react-router-dom";

const SupervisorStudent = () => {
  const { user_id } = useParams();
  const { authTokens, user } = useContext(AuthContext);
  const [students, setStudents] = useState([]); // Ensure it's an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/user/studentleadsupervisor/${user.user_id}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`, // Send token in headers
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data; // Extract data from response

        if (data.students && Array.isArray(data.students)) {
          setStudents(data.students);
          console.log(data)
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user.user_id, authTokens.access]); // Include authTokens.access to refresh if token changes

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Students supervised by Supervisor {user.user_id}
      </h2>
      {students.length > 0 ? (
        <ul className="space-y-4">
          {students.map((student) => (
            <li
              key={student.user_id}
              className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition"
            >
              <div className="font-bold text-lg">
                {student.first_name} {student.last_name}
              </div>
              <div className="text-gray-600">{student.programme}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500">No students found.</div>
      )}
    </div>
  );
};

export default SupervisorStudent;
