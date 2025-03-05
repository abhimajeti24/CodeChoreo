import React, { useState, useRef, useEffect } from 'react';
import { IoMdSend } from 'react-icons/io';
import { FaRobot } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FaCheck, FaTimes, FaEdit, FaPlus } from 'react-icons/fa';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
    withCredentials: true
});

interface Message {
    role: 'user' | 'assistant';
    content: string;
    suggestions?: string[];
    timestamp?: number;
    context?: {
        code?: string;
        filePath?: string;
        error?: string;
        outputLogs?: string;
    };
}

interface ChatBotProps {
    codeContent?: string;
    error?: string;
    filePath?: string;
    roomId: string;
    onAcceptSuggestion?: (suggestion: string) => void;
    onClose?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ codeContent, error, filePath, roomId, onAcceptSuggestion, onClose }) => {
    const userId = localStorage.getItem('userId');
    const storageKey = `chatMessages_${userId}_${roomId}`;

    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [];
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [width, setWidth] = useState(() => {
        const saved = localStorage.getItem('chatWidth');
        return saved ? parseInt(saved) : 400;
    });
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const resizeRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);

    // Update messages when room changes
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        setMessages(saved ? JSON.parse(saved) : []);
    }, [storageKey]);

    // Save messages with room-specific key
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(messages));
    }, [messages, storageKey]);

    useEffect(() => {
        localStorage.setItem('chatWidth', width.toString());
    }, [width]);

    // Scroll to bottom when new messages are added
    useEffect(() => {
        if (chatContainerRef.current && messages.length > 0) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]); // Run when messages change

    // Add resize functionality
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (resizeRef.current?.contains(e.target as Node)) {
                isDraggingRef.current = true;
                document.body.style.cursor = 'ew-resize';
                document.body.style.userSelect = 'none';
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            e.preventDefault();
            requestAnimationFrame(() => {
                const newWidth = window.innerWidth - e.clientX;
                if (newWidth >= 300 && newWidth <= 800) {
                    setWidth(newWidth);
                }
            });
        };

        const handleMouseUp = () => {
            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: Date.now(),
            context: {
                code: codeContent || undefined,
                filePath: filePath || undefined,
                error: error || undefined,
                outputLogs: document.querySelector('.output-section')?.textContent || undefined
            }
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Get recent context from the last few messages
            const recentMessages = messages.slice(-5).map(msg => ({
                role: msg.role,
                content: msg.content,
                context: msg.context
            }));

            const response = await api.post('/api/chat', {
                message: input,
                currentCode: codeContent,
                filePath: filePath,
                error: error,
                outputLogs: document.querySelector('.output-section')?.textContent || null,
                conversationHistory: recentMessages,
                roomId: roomId // Add roomId to the request
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.message || 'No response received',
                suggestions: response.data.suggestions,
                timestamp: Date.now(),
                context: userMessage.context
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error while processing your request. Please try again.',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptSuggestion = (suggestion: string) => {
        if (onAcceptSuggestion) {
            onAcceptSuggestion(suggestion);
        }
    };

    const handleEdit = (index: number, newContent: string) => {
        setMessages(prev => prev.map((msg, i) => 
            i === index ? { 
                ...msg, 
                content: newContent,
                timestamp: Date.now() 
            } : msg
        ));
        setEditingMessageId(null);
    };

    const startNewChat = () => {
        setMessages([]);
        localStorage.removeItem(storageKey);
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = 0;
        }
    };

    const newChatButton = (
        <button
            onClick={startNewChat}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
            title="Start new chat"
        >
            <FaPlus size={16} />
        </button>
    );

    return (
        <div 
            className="fixed right-0 top-0 h-screen bg-gray-900 shadow-lg flex flex-col z-50 transition-[width] duration-75"
            style={{ width: `${width}px` }}
        >
            <div 
                ref={resizeRef}
                className="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-blue-500 bg-gray-700 transition-colors"
            />
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center">
                    <FaRobot className="text-blue-500 text-xl mr-2" />
                    <h2 className="text-white text-lg font-semibold">Code Assistant</h2>
                </div>
                <div className="flex items-center gap-2">
                    {newChatButton}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Close"
                        >
                            <IoMdClose size={24} />
                        </button>
                    )}
                </div>
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
                        } w-full relative group`}
                    >
                        {message.role === 'user' && (
                            <button
                                onClick={() => setEditingMessageId(index)}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 z-10"
                                title="Edit message"
                            >
                                <FaEdit size={14} />
                            </button>
                        )}
                        <div
                            className={`flex items-start space-x-2 ${
                                message.role === 'user'
                                    ? 'flex-row-reverse space-x-reverse'
                                    : 'flex-row'
                            } max-w-[85%]`}
                        >
                            {message.role === 'user' ? (
                                <FaUser className="text-gray-400 mt-1 flex-shrink-0 mx-2" />
                            ) : (
                                <FaRobot className="text-blue-500 mt-1 flex-shrink-0 mx-2" />
                            )}
                            <div
                                className={`p-3 rounded-lg overflow-hidden ${
                                    message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-200'
                                }`}
                                style={{ wordBreak: 'break-word', width: '100%' }}
                            >
                                {editingMessageId === index && message.role === 'user' ? (
                                    <div className="flex flex-col space-y-2">
                                        <textarea
                                            className="w-full bg-gray-800 text-white rounded p-2 resize-y min-h-[60px]"
                                            value={message.content}
                                            onChange={(e) => handleEdit(index, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleEdit(index, message.content);
                                                }
                                            }}
                                            autoFocus
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => setEditingMessageId(null)}
                                                className="text-sm text-gray-400 hover:text-white"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleEdit(index, message.content)}
                                                className="text-sm text-blue-400 hover:text-blue-300"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                    </div>
                                )}
                                {message.suggestions && message.suggestions.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                        <p className="text-sm font-semibold text-blue-300">Suggestions:</p>
                                        {message.suggestions.map((suggestion, idx) => (
                                            <div key={idx} className="bg-gray-800 p-2 rounded">
                                                <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-words">{suggestion}</pre>
                                                <div className="flex justify-end mt-1 space-x-2">
                                                    <button
                                                        onClick={() => handleAcceptSuggestion(suggestion)}
                                                        className="text-green-500 hover:text-green-400"
                                                        title="Accept suggestion"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        className="text-red-500 hover:text-red-400"
                                                        title="Reject suggestion"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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