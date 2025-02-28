import React from 'react';
import { useChatBot } from '../../context/ChatBotContext';
import ChatBot from './ChatBot';

const ChatBotContainer: React.FC = () => {
    const { isOpen, currentCode, currentError } = useChatBot();

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-20 right-4 w-96 h-[600px] z-50">
            <ChatBot 
                codeContent={currentCode || undefined}
                error={currentError || undefined}
            />
        </div>
    );
};

export default ChatBotContainer; 