import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import for navigation
import '../css/Messages.css';

function Messages() {
    const navigate = useNavigate(); // ✅ setup navigation

    const [messages, setMessages] = useState([
        { sender: 'Landlord John', text: 'Hello! How can I help you?' }
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { sender: 'You', text: newMessage }]);
            setTimeout(() => {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: 'Landlord John', text: "Thanks for your message! I'll get back to you soon." }
                ]);
            }, 1000);
            setNewMessage('');
        } else {
            alert('Please enter a message.');
        }
    };

    return (
        <div className="container">
            <h2>Messages</h2>
            <h3>Chat with Landlord John</h3>

            {/* ✅ Back Button */}
            <button className="back-btn" onClick={() => navigate("/homepage")}>
                🔙 Back to Homepage
            </button>

            <div className="chat-container">
                {messages.map((msg, index) => (
                    <p key={index}>{msg.sender}: {msg.text}</p>
                ))}
            </div>
            <div className="message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Messages;
