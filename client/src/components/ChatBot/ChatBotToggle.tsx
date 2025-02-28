import React from 'react';
import { FaRobot } from 'react-icons/fa';
import { useChatBot } from '../../context/ChatBotContext';

const ChatBotToggle: React.FC = () => {
    const { toggleChat, isOpen } = useChatBot();

    return (
        <button
            onClick={toggleChat}
            className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg transition-all duration-300 ${
                isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            aria-label="Toggle Chat Assistant"
        >
            <FaRobot className="text-white text-xl" />
        </button>
    );
};

export default ChatBotToggle; 