









import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { useParams, Link } from 'react-router-dom';

const StudentLeadForSupervisor = () => {
  const { user_id } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url =`http://127.0.0.1:8000/user/onestudentlead/${user_id}/`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data)
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [user_id, authTokens]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="w-full mx-auto p-2 bg-white rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-green-600">Student/-Leads More Data:</h2>
    
        <div className="grid text-center">
                    <div key={data.user_id} className=" p-4 rounded-md">
                    <h4 className="text-xl font-semibold my-2"><span className="text-green-500 font-semibold">Student Lead:</span> {data.student_lead.first_name} {data.student_lead.last_name}</h4>
                    <h4 className="text-xl font-semibold my-2"><span className="text-green-500 font-semibold">Programme: </span>{data.student_lead.programme}</h4>
                    
                      <section className="">

                            <ul className="">
                              {data.members.map((member, index) => (
                                  <li key={index}>
                                  <fieldset className="border-1 rounded-lg border-green-500 p-4 text-left">
                                      <legend className="font-semibold text-lg text-yellow-400 px-2">Project Member</legend>
                                      <span className="text-green-500 font-semibold"> </span>{member.first_name} {member.last_name}
                                  </fieldset>
                                  </li>
                              ))}
                            </ul>


                      </section>
                      <section className="">
                        <fieldset className="border-2 rounded-lg border-green-500 p-2 sm:p-6">
                          <legend className="font-semibold text-lg text-yellow-400 px-2">Projects</legend>

                            <ul className="">
                              {data.projects.map((project, index) => (
                                  <li key={index}>
                                    <p className="text-xl">
                                      <span className="text-green-500 font-semibold text-lg">Title: </span >{project.title}
                                    </p>

                                  <fieldset className="border-1 rounded-lg border-green-500 p-2 text-left">
                                      <legend className="font-semibold text-lg text-yellow-400 px-2">Description</legend>
                                      <span className="text-green-500 font-semibold"> </span>{project.description}
                                  </fieldset>
                                  </li>
                              ))}
                            </ul>
                        </fieldset>
                      </section>

                    </div>
        </div>
      
      <button className="border-2 border-yellow-400 px-8 rounded-xl py-1 text-lg mt-8 text-green-500 font-semibold">
        <Link to='/home'>..home</Link>
      </button>
      
    </div>
  );

};

export default StudentLeadForSupervisor;
