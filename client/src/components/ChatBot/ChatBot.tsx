import React, { useState, useRef, useEffect } from 'react';
import { IoMdSend } from 'react-icons/io';
import { FaRobot } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
    withCredentials: true
});

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatBotProps {
    codeContent?: string;
    error?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ codeContent, error }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            console.log('Sending request to:', `${api.defaults.baseURL}/api/chat`);
            const response = await api.post('/api/chat', {
                message: input,
                code: codeContent,
                error: error
            });

            console.log('Response:', response.data);

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.message || 'No response received'
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
            if (axios.isAxiosError(err)) {
                console.error('Axios error details:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    headers: err.response?.headers
                });
            }
            
            // Add error message to chat
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error while processing your request. Please check the console for details and try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 rounded-lg shadow-lg">
            <div className="flex items-center p-4 border-b border-gray-700">
                <FaRobot className="text-blue-500 text-xl mr-2" />
                <h2 className="text-white text-lg font-semibold">Code Assistant</h2>
            </div>
            
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`flex items-start space-x-2 max-w-[80%] ${
                                message.role === 'user'
                                    ? 'flex-row-reverse space-x-reverse'
                                    : 'flex-row'
                            }`}
                        >
                            {message.role === 'user' ? (
                                <FaUser className="text-gray-400 mt-1" />
                            ) : (
                                <FaRobot className="text-blue-500 mt-1" />
                            )}
                            <div
                                className={`p-3 rounded-lg ${
                                    message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-200'
                                }`}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 text-gray-200 p-3 rounded-lg">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about your code..."
                        className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        <IoMdSend className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot; 