import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', { message: input });
            const botMessage = { text: response.data.reply, sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { text: 'Sorry, something went wrong. Please try again.', sender: 'bot' };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {isOpen && (
                <div style={styles.chatWindow}>
                    <div style={styles.header}>
                        <h3>AI Assistant</h3>
                        <button onClick={toggleChat} style={styles.closeButton}>X</button>
                    </div>
                    <div style={styles.messagesContainer}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                ...styles.message,
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f1f1',
                                color: msg.sender === 'user' ? '#fff' : '#000',
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div style={styles.loading}>Typing...</div>}
                    </div>
                    <form onSubmit={sendMessage} style={styles.inputForm}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            style={styles.input}
                        />
                        <button type="submit" style={styles.sendButton} disabled={isLoading}>Send</button>
                    </form>
                </div>
            )}
            <button onClick={toggleChat} style={styles.toggleButton}>
                💬
            </button>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        fontFamily: 'Arial, sans-serif',
    },
    toggleButton: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: '#fff',
        fontSize: '30px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    chatWindow: {
        position: 'absolute',
        bottom: '80px',
        right: '0',
        width: '350px',
        height: '500px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
    },
    messagesContainer: {
        flex: 1,
        padding: '15px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    message: {
        padding: '10px 15px',
        borderRadius: '15px',
        maxWidth: '80%',
        wordWrap: 'break-word',
    },
    inputForm: {
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #eee',
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #ddd',
        marginRight: '10px',
        outline: 'none',
    },
    sendButton: {
        padding: '10px 20px',
        borderRadius: '20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
    },
    loading: {
        alignSelf: 'flex-start',
        color: '#888',
        fontSize: '12px',
        marginLeft: '10px',
    },
};

export default Chatbot;
