import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const StudentLeadForSupervisor = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const { authTokens, user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `http://localhost:8000/user/studentleadsupervisor/${user.user_id}/`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((response) => {
        setData(response.data);
        // console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [user.user_id, authTokens]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="w-full sm:p-2 p-6 bg-white rounded-lg ">
      <h2 className="text-xl font-semibold mb-6 text-center text-green-600">
        Students
      </h2>
      {data.students.length === 0 ? (
        <p>No students assigned.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full font-aptos border-collapse mt-3">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left sm:table-cell hidden">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left sm:table-cell hidden">
                  Registration Number
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left sm:table-cell hidden">
                  Course
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left sm:table-cell hidden">
                  Project Title
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left sm:table-cell hidden">
                  Project Status
                </th>
                <th className="border border-gray-300 px-4 py-2 sm:table-cell hidden">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.students.length > 0 ? (
                data.students.map((student) => (
                  <tr
                    key={student.user_id}
                    className="border border-gray-300 hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/onestudentleadforsupervisor/${student.user_id}`
                      )
                    }
                  >
                    {/* Name */}
                    <td className="px-4 py-2 border border-gray-300 sm:table-cell block">
                      {student.first_name} {student.last_name}
                    </td>
                    {/* Registration Number */}
                    <td className="px-4 py-2 border border-gray-300 sm:table-cell block">
                      {student.projects.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {student.projects.map((project, index) => (
                            <li key={index}>
                              <strong>{project.user.username}</strong>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>--</p>
                      )}
                    </td>
                    {/* Course */}
                    <td className="px-4 py-2 border border-gray-300 sm:table-cell block">
                      {student.programme || "N/A"}
                    </td>
                    {/* Project Title */}
                    <td className="px-4 py-2 border border-gray-300 sm:table-cell block">
                      {student.projects.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {student.projects.map((project, index) => (
                            <li key={index}>
                              <strong>{project.title}</strong>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No projects created.</p>
                      )}
                    </td>
                    {/* Project Status */}
                    <td className="px-4 py-2 border border-gray-300 sm:table-cell block">
                      {student.projects.length > 0 ? (
                        student.projects[0].status || "N/A"
                      ) : (
                        <p>No status</p>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-2 border border-gray-300 sm:table-cell block">
                      <button
                        className="border border-green-600 text-green-900 px-3 py-1 rounded-md font-bold cursor-pointer hover:bg-green-700"
                        onClick={() =>
                          navigate(
                            `/onestudentleadforsupervisor/${student.user_id}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-2 border border-gray-300 text-center"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentLeadForSupervisor;
