



import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";

const CreateProjectChapters = () => {
    const { user_id } = useParams();
    const { authTokens, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [chapters, setChapters] = useState([
        { chapter_name: "", chapter_title: "" },
    ]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (index, e) => {
        const newChapters = [...chapters];
        newChapters[index][e.target.name] = e.target.value;
        setChapters(newChapters);
    };

    // Add a new chapter field
    const addChapter = () => {
        setChapters([...chapters, { chapter_name: "", chapter_title: "" }]);
    };

    // Remove a Chapter field
    const removeChapter = (index) => {
        const newChapters = chapters.filter((_, i) => i !== index);
        setChapters(newChapters);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Updated request data structure
        const requestData = {
            chapters: chapters  // No user field added here
        };

        const url = "http://127.0.0.1:8000/chapters/create/";

        try {
            await axios.post(url, requestData, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
            });

            navigate(`/view_project/${user_id}`);
            
        } catch (err) {
            if (err.response && err.response.data) {
                // Handle field-specific errors if needed
                setError(
                    err.response.data.non_field_errors?.join(", ") || 
                    JSON.stringify(err.response.data) || 
                    "An error occurred."
                );
            } else {
                setError("A network error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ... rest of the component remains the same ...
    // (The JSX rendering code doesn't need changes)

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Project Chapters</h2>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form onSubmit={handleSubmit}>
                {chapters.map((chapter, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg">
                        <div className="mb-2">
                            <label className="block text-gray-700">Chapter name/number</label>
                            <input
                                type="text"
                                name="chapter_name"
                                value={chapter.chapter_name}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-gray-700">Chapter Title</label>
                            <input
                                type="text"
                                name="chapter_title"
                                value={chapter.chapter_title}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        {chapters.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeChapter(index)}
                                className="mt-2 px-4 py-2 text-white bg-red-500 rounded-lg"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}

                <section className="grid grid-cols-2 mt-8 gap-8">
                    <button
                        type="button"
                        onClick={addChapter}
                        className="w-full bg-green-500 text-white py-2 rounded-lg mb-4"
                    >
                        + Add Another Chapter/s
                    </button>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 mb-4 rounded-lg hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Saving chapters..." : "Submit Chapters"}
                    </button>
                </section>
            </form>

            <button className="border-2 border-green-600 rounded-lg py-1 px-4 my-4">
                <Link to={`/view_project/${user_id}`}>Cancel</Link>
            </button>
        </div>
    );
};

export default CreateProjectChapters;