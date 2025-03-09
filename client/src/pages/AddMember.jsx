


import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link,useParams, } from "react-router-dom";
import axios from "axios";
import Header from '../components/Header'

const AddMember = () => {
    const { user_id } = useParams();
    const { authTokens, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [participants, setParticipants] = useState([
        { first_name: "", last_name: "", admision_no: "", programme: "", mail:"" },
    ]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (index, e) => {
        const newParticipants = [...participants];
        newParticipants[index][e.target.name] = e.target.value;
        setParticipants(newParticipants);
    };

    // Add a new participant field
    const addParticipant = () => {
        setParticipants([...participants, { first_name: "", last_name: "", admision_no: "", programme: "", mail:"" }]);
    };

    // Remove a participant field
    const removeParticipant = (index) => {
        const newParticipants = participants.filter((_, i) => i !== index);
        setParticipants(newParticipants);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Ensure the data is a dictionary with a key "participants"
        const requestData = {
            participants: participants.map((participant) => ({
                ...participant,
                user: user.id, // Add user ID to each participant
            })),
        };

        const url = "http://localhost:8000/members/create/";

        try {
            await axios.post(url, requestData, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
            });

            navigate(`/view_project/${user_id}`); // Redirect after success
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.non_field_errors?.join(", ") || "An error occurred.");
            } else {
                setError("A network error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full mx-auto  p-6 bg-white shadow-lg rounded-lg">
            <Header/>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4 sm:px-24 px-4">
                {participants.map((participant, index) => (
                    <fieldset key={index} className="mb-4 p-4 px-2 sm:px-8 border rounded-lg">
                        <legend className="text-xl font-bold mb-4 px-2 text-center">Add Project Members</legend>
                        <div className="mb-2">
                            <label className="block text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={participant.first_name}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={participant.last_name}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-gray-700">Admission No</label>
                            <input
                                type="text"
                                name="admision_no"
                                value={participant.admision_no}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-gray-700">Programme</label>
                            <input
                                type="text"
                                name="programme"
                                value={participant.programme}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="mail"
                                value={participant.mail}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        {participants.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeParticipant(index)}
                                className="mt-2 px-4 py-2 text-white bg-red-500 rounded-lg"
                            >
                                Remove
                            </button>
                        )}
                    </fieldset>
                ))}


                <section className="grid grid-cols-2 mt-8 gap-8">
                    <button
                        type="button"
                        onClick={addParticipant}
                        className="w-full bg-green-500 font-semibold text-blue-900 py-2 rounded-lg "
                    >
                        + Add Another Member
                    </button>

                    <button
                        type="submit"
                        className="w- border border-blue-600 text-green-900 font-semibold py-2 rounded-lg hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Submit Members"}
                    </button>
                </section>
            </form>

            <button className="border-2 border-green-600 py-1 px-4 my-4">
                <Link to={`/view_project/${user_id}`}>Cancel</Link>
            </button>
        </div>
    );
};

export default AddMember;
