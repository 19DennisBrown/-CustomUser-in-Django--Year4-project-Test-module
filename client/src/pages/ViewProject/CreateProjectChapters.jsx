import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AuthContext from "../../context/AuthContext"; // Import the AuthContext
import Header from "../../components/Header";

const CreateProjectChapters = () => {
  const { authTokens } = useContext(AuthContext); // Access authTokens from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedFile, setSelectedFile] = useState(null);
  const [chapterName, setChapterName] = useState("");
  const [name, setName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    setLoading(true);
    if (!selectedFile || !chapterName || !name) {
      setUploadStatus("Please fill all fields and select a file.");
      return;
    }

    // Check file size (2MB limit)
    if (selectedFile.size > 2 * 1024 * 1024) {
      setUploadStatus("File size exceeds 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("chapter_name", chapterName);
    formData.append("name", name);
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/chapters/files/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authTokens.access}`, // Include the authorization token
          },
        }
      );

      if (response.status === 201) {
        // 201 Created is a common status code for successful uploads
        setUploadStatus("File uploaded successfully!");
        setTimeout(() => {
          navigate(-1); // Navigate to /home after a successful upload
        }, 2000); // Wait 2 seconds before navigating
      } else {
        setUploadStatus("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
      // Display specific error message from the backend if available
      if (error.response && error.response.data && error.response.data.error) {
        setUploadStatus(`Error: ${error.response.data.error}`);
      } else {
        setUploadStatus("Failed to upload file. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="w-full p-4 bg-gray-100 rounded-lg shadow-md">
      <Header />

      <section className=" sm:px-24 px-4">
        <h1 className="text-2xl font-bold mb-4">File Upload</h1>
        <input
          type="text"
          placeholder="Chapter Name/  eg One "
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Chapter title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 p-2 border border-green-300 rounded w-full"
          required
        />
        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`w-full py-1  font-semibold rounded-md text-green-900 transition flex justify-center items-center ${
              loading
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600 hover:opacity-80"
            }`}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-t-2 border-green-500 rounded-full animate-spin mr-2"></span>
            )}
            {loading ? "Uploading..." : "Upload."}
          </button>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full py-1 font-semibold border border-gray-600 text-blue-900 rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </section>
      {uploadStatus && <p className="mt-4 text-gray-700">{uploadStatus}</p>}
    </div>
  );
};

export default CreateProjectChapters;
