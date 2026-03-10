import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! 👋 I'm your Swatch Village assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

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
            {/* Chat Window */}
            <div style={{
                ...styles.chatWindow,
                transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? 'auto' : 'none',
            }}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={styles.headerIcon}>🤖</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI Assistant</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Powered by Gemini</div>
                        </div>
                    </div>
                    <button onClick={toggleChat} style={styles.closeButton} title="Close chat">
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div style={styles.messagesContainer}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.messageRow,
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div style={{
                                ...styles.message,
                                ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage),
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
                            <div style={{ ...styles.message, ...styles.botMessage, ...styles.typing }}>
                                <span style={styles.dot} />
                                <span style={{ ...styles.dot, animationDelay: '0.15s' }} />
                                <span style={{ ...styles.dot, animationDelay: '0.3s' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} style={styles.inputForm}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        style={styles.input}
                    />
                    <button type="submit" style={styles.sendButton} disabled={isLoading || !input.trim()}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                style={{
                    ...styles.toggleButton,
                    transform: isOpen ? 'scale(0.9) rotate(90deg)' : 'scale(1) rotate(0deg)',
                }}
                title={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Inline keyframe styles */}
            <style>{`
                @keyframes chatDot {
                    0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
                    30% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    toggleButton: {
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0f9d84, #0a7363)',
        color: '#fff',
        fontSize: 26,
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(15, 157, 132, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
    },
    chatWindow: {
        position: 'absolute',
        bottom: 76,
        right: 0,
        width: 380,
        height: 520,
        backgroundColor: '#fff',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.15), 0 1px 3px rgba(15, 23, 42, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    header: {
        background: 'linear-gradient(135deg, #0f9d84, #0a7363)',
        color: '#fff',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
    },
    closeButton: {
        background: 'rgba(255,255,255,0.15)',
        border: 'none',
        color: '#fff',
        fontSize: 14,
        width: 32,
        height: 32,
        borderRadius: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.15s',
        padding: 0,
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: '#f8fafc',
    },
    messageRow: {
        display: 'flex',
        width: '100%',
    },
    message: {
        padding: '10px 16px',
        borderRadius: 16,
        maxWidth: '82%',
        wordWrap: 'break-word',
        fontSize: '0.88rem',
        lineHeight: 1.55,
    },
    userMessage: {
        background: 'linear-gradient(135deg, #0f9d84, #0a7363)',
        color: '#fff',
        borderBottomRightRadius: 4,
    },
    botMessage: {
        background: '#fff',
        color: '#334155',
        border: '1px solid #e2e8f0',
        borderBottomLeftRadius: 4,
    },
    typing: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '14px 20px',
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: '#94a3b8',
        display: 'inline-block',
        animation: 'chatDot 1.2s infinite ease-in-out',
    },
    inputForm: {
        display: 'flex',
        padding: 12,
        gap: 8,
        borderTop: '1px solid #f1f5f9',
        background: '#fff',
    },
    input: {
        flex: 1,
        padding: '11px 16px',
        borderRadius: 12,
        border: '1.5px solid #e2e8f0',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.88rem',
        outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        background: '#f8fafc',
    },
    sendButton: {
        width: 42,
        height: 42,
        borderRadius: 12,
        background: 'linear-gradient(135deg, #0f9d84, #0a7363)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s',
        padding: 0,
    },
};

export default Chatbot;
