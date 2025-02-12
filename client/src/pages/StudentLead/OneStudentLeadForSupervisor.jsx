




import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Chat from "../Chat/Chat";

const StudentLeadForSupervisor = () => {
  const { user_id } = useParams();
  const { authTokens, user } = useContext(AuthContext);
  
  const [information, setData] = useState(null);
  const [infos, setInfos] = useState(null);
  const [projectMembers, setMember] = useState([]);
  const [chatData, setChatData] = useState([]);
  
  // We'll use a single loading state for simplicity.
  const [loading, setLoading] = useState(true);
  // Instead of blocking the UI on error, we store the error message to display it in a banner.
  const [error, setError] = useState(null);

  // Fetch student lead information.
  useEffect(() => {
    const url = `http://127.0.0.1:8000/user/onestudentlead/${user_id}/`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((response) => {
        setData(response.data);
        // Set the student lead's user ID so we can later fetch project members.
        setInfos(response.data.student_lead.user_id);
        setChatData(response.data.student_lead)
        // console.log(response.data.student_lead)

      })
      .catch((err) => {
        // Append the error message to our error state.
        setError((prev) =>
          prev ? prev + " " + (err.response?.data?.detail || err.message) : err.response?.data?.detail || err.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user_id, authTokens]);

  // Fetch project members when the student lead ID is available.
  useEffect(() => {
    if (infos) {
      fetchingMembers(infos);
    }
  }, [infos, authTokens]);

  const fetchingMembers = (info) => {
    const url = `http://127.0.0.1:8000/members/view/${info}/`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((response) => {
        setMember(response.data.members);
        // setChatData(response.data.student_lead)
        // console.log(response.data.student_lead)
      })
      .catch((err) => {
        setError((prev) =>
          prev ? prev + " " + (err.response?.data?.detail || err.message) : err.response?.data?.detail || err.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full mx-auto p-2 bg-gray-200 rounded-lg">
      {/* Show a spinner overlay if still loading */}
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {/* Once loading is done, render the UI. */}
      {!loading && (
        <>
          {/* Display any errors as a banner (if they exist) */}
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <h2 className="text-3xl font-semibold mb-6 text-center text-green-600">
            Student/-Leads More Data:
          </h2>
          {/* STUDEND LEAD INFO */}
          <div className="grid text-center">
            {information ? (
              <div key={information.user_id} className="p-4 rounded-md">
                <h4 className="text-xl font-semibold my-2">
                  <span className="text-green-500 font-semibold">Student Lead:</span>{" "}
                  {information.student_lead.first_name} {information.student_lead.last_name}{" "}
                  
                </h4>
                <h4 className="text-xl font-semibold my-2">
                  <span className="text-green-500 font-semibold">Programme: </span>
                  {information.student_lead.programme}
                </h4>
                <h4 className="text-xl font-semibold my-2">
                  <span className="text-green-500 font-semibold">Registration No: </span>
                  {information.student_lead.user.username}
                </h4>

                {/* PROJECT DETAILS */}
                <section className="">
                  <fieldset className="border-2 rounded-lg border-green-500 p-2 sm:p-6">
                    <legend className="font-semibold text-lg text-yellow-400 px-2">
                      Project
                    </legend>
                    <ul className="">
                      {information.projects && information.projects.length > 0 ? (
                        information.projects.map((project, index) => (
                          <li key={index}>
                            <p className="text-xl">
                              <span className="text-green-500 font-semibold text-lg">Title: </span>
                              {project.title}
                            </p>
                            <fieldset className="border-1 rounded-lg border-green-500 p-2 text-left">
                              <legend className="font-semibold text-lg text-yellow-400 px-2">
                                Description
                              </legend>
                              <span className="text-green-500 font-semibold"> </span>
                              {project.description}
                            </fieldset>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-600">No projects found.</p>
                      )}
                    </ul>
                  </fieldset>
                </section>

                {/* PROJECT MEMBERS */}
                <section className="mt-12">
                  <fieldset className="border-t-3 rounded-lg border-green-500 p-4 text-left grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <legend className="font-semibold text-xl text-yellow-400 px-2">
                      Project Member
                    </legend>
                    {projectMembers && projectMembers.length > 0 ? (
                      projectMembers.map((projectMember, index) => (
                        <fieldset
                          key={index}
                          className="border-1 rounded-lg border-green-500 p-4 text-left"
                        >
                          <legend className="font-semibold text-lg text-yellow-400 px-2">
                            {projectMember.last_name}
                          </legend>
                          <span className="text-green-500 font-semibold"> </span>
                          {projectMember.first_name} {projectMember.last_name}
                          <p>
                            <span className="text-green-500 font-semibold">Programme: </span>
                            {projectMember.programme}
                          </p>
                          <p>
                            <span className="text-green-500 font-semibold">Reg No: </span>
                            {projectMember.admision_no}
                          </p>
                          <p>
                            <span className="text-green-500 font-semibold">Email: </span>
                            {projectMember.mail || "null"}
                          </p>
                        </fieldset>
                      ))
                    ) : (
                      <p className="text-gray-600">No project members found.</p>
                    )}
                  </fieldset>
                </section>
              </div>
            ) : (
              <p className="text-gray-600">No student lead data available.</p>
            )}
          </div>

          <div className="flex flex-col items-center mt-8">
            <button className="border-2 border-yellow-400 px-8 rounded-xl py-1 text-lg text-green-500 font-semibold mb-4">
              <Link to="/home">..Exit</Link>
            </button>
            {/* Render the Chat component below the student lead info. */}

            {/* chat */}
            <Chat chatInfo={chatData} UserId={user.user_id} />
          </div>
        </>
      )}
    </div>
  );
};

export default StudentLeadForSupervisor;
