






import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Chat = ({ conversationId }) => {
    const { authTokens, user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchMessages();
    }, [conversationId]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/api/conversations/${conversationId}/messages/`, {
                headers: {
                    Authorization: `Bearer ${authTokens?.access}`,
                },
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            await axios.post(
                `/api/conversations/${conversationId}/messages/`,
                { content: newMessage },
                {
                    headers: {
                        Authorization: `Bearer ${authTokens?.access}`,
                    },
                }
            );
            setNewMessage('');
            fetchMessages(); // Refresh messages after sending
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col w-full max-w-lg mx-auto border border-gray-300 rounded-lg shadow-md p-4 bg-white">
            <div className="flex flex-col space-y-2 h-64 overflow-y-auto p-2 border-b border-gray-300">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`p-2 rounded-lg max-w-xs ${message.created_by.username === user.username ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-900 self-start'}`}
                    >
                        <strong>{message.created_by.username}:</strong> {message.content}
                    </div>
                ))}
            </div>
            <div className="flex items-center mt-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
