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
  const [sending, setSending] = useState(false); // New sending state

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
        const url = `http://localhost:8000/chat/chat_messages/${student_lead_id}/${supervisor_id}/`;
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

    setSending(true); // Disable the submit button

    try {
      const response = await axios.post(
        'http://localhost:8000/chat/chat_messages/create/',
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
    } finally {
      setSending(false); // Re-enable the submit button
    }
  };

  return (
    <div className="w-full  mx-1 sm:mx-auto p-1  sm:p-8 bg-gray-300 shadow-lg rounded-lg">
      {loading && (
        <div className="flex justify-center items-center h-16">
          <div className="w-8 h-8 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
        </div>
      )}
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>}
      <h2 className="text-lg sm:text-2xl font-bold mb-4">Talk to {user.role === 'student' ? 'Supervisor' : 'Student Lead'}</h2>
      <div className="chat-box mb-6 p-1 sm:p-4 bg-gray-500 rounded-lg shadow-sm max-h-96 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className={`message mb-4 px-3 py-1 rounded-md border ${message.user?.role === 'student' ? "text-right bg-green-100" : "text-left bg-yellow-100"}`}>
              <p className="text-gray-900 mb-4 text-lg">{message.content}</p>
              <hr />
              <p className="text-sm text-gray-900">Sent at {new Date(message.created_at).toLocaleString()} by @{message.user?.username}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No messages yet.</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="grid border border-green-900 rounded-sm sm:rounded-md grid-cols-6 gap-1 sm:gap-4">
        <textarea
          className="message-input p-1 sm:p-3 border col-span-5 focus:outline-none border-gray-300 rounded-md"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message here"
          rows="1"
          required
        />
        <button
          type="submit"
          className="submit-button w-full font-semibold sm:text-md text-sm py-2 px-0 sm:px-4 bg-green-500 rounded-sm sm:rounded-md hover:bg-blue-600 transition duration-200"
          disabled={sending} // Disable button while sending
        >
          {sending ? 'Sending...' : 'Send'} {/* Change button text based on sending state */}
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