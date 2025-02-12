



import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import PropTypes from 'prop-types';

const Chat = ({ chatInfo, projectData }) => {
  const { user, authTokens } = useContext(AuthContext);

  // Local state for messages, new message content, loading, and error statuses
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [supervisorID, setSupervisorID] = useState();
  const [studentLeadID, setStudentLeadID] = useState();

  // Update supervisorID and studentLeadID using chatInfo or fallback to projectData
  useEffect(() => {
    const supervisorIdFromChat = chatInfo?.supervisor?.user?.id;
    const supervisorIdFromProject = projectData?.student_lead?.supervisor?.user_id;

    const studentLeadIdFromChat = chatInfo?.user?.id;
    const studentLeadIdFromProject = projectData?.student_lead?.user_id;

    setSupervisorID(supervisorIdFromChat || supervisorIdFromProject);
    setStudentLeadID(studentLeadIdFromChat || studentLeadIdFromProject);

    console.log("Supervisor ID:", supervisorIdFromChat || supervisorIdFromProject);
    console.log("Student Lead ID:", studentLeadIdFromChat || studentLeadIdFromProject);
  }, [chatInfo, projectData]);

  useEffect(() => {
    if (!user || !authTokens) {
      setError('Authentication required.');
      setLoading(false);
      return;
    }

    // Determine conversation participants based on user role
    const student_lead_id = user.role === 'student' ? user.user_id : studentLeadID;
    const supervisor_id = user.role === 'supervisor' ? user.user_id : supervisorID;

    // Ensure both IDs are available before fetching
    if (!student_lead_id || !supervisor_id) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const url = `http://127.0.0.1:8000/chat/chat_messages/${student_lead_id}/${supervisor_id}/`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setMessages(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, authTokens, studentLeadID, supervisorID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || !user || !authTokens) return;

    const student_lead_id = user.role === 'student' ? user.user_id : studentLeadID;
    const supervisor_id = user.role === 'supervisor' ? user.user_id : supervisorID;

    if (!student_lead_id || !supervisor_id) {
      setError('Missing participant information.');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/chat/chat_messages/create/',
        {
          student_lead: student_lead_id,
          supervisor: supervisor_id,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessages([...messages, response.data]);
      setContent('');
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : err.message);
    }
  };

  return (
    <div className="w-[60vw] mx-auto p-8 bg-gray-500 shadow-lg rounded-lg">
      {/* Display a spinner overlay while loading */}
      {loading && (
        <div className="flex justify-center items-center h-16">
          <div className="w-8 h-8 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error banner displayed inside the chat container */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Talk to {user.role == 'student'? "Supervisor": "Student Lead"}</h2>

      <div className="chat-box mb-6 p-4 bg-gray-50 rounded-lg shadow-sm max-h-96 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className={`message mb-4 p-3 rounded-md border ${user.user_id === studentLeadID ? "text-right ":" text-left"}`}>

              <p className={`text-gray-900 mb-4 text-lg`}>{message.content}</p>
              <hr />
              <p className="text-sm text-gray-500">
                Sent at {new Date(message.created_at).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No messages yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="message-input p-3 border border-gray-300 rounded-md"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message here"
          rows="3"
        />
        <button
          type="submit"
          className="submit-button w-[20vw] font-semibold py-2 px-6 bg-green-500 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Send
        </button>
      </form>
    </div>
  );
};

Chat.propTypes = {
  chatInfo: PropTypes.shape({
    supervisor: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      }),
    }),
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }),
  projectData: PropTypes.shape({
    student_lead: PropTypes.shape({
      user_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      supervisor: PropTypes.shape({
        user_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
    }),
  }),
};

export default Chat;
