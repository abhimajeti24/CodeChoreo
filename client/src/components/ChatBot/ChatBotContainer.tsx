import React from 'react';
import { useChatBot } from '../../context/ChatBotContext';
import ChatBot from './ChatBot';

const ChatBotContainer: React.FC = () => {
    const { 
        isOpen, 
        currentCode, 
        currentError, 
        currentFilePath,
        handleCodeSuggestion,
        toggleChat
    } = useChatBot();

    if (!isOpen) return null;

    return (
        <ChatBot 
            codeContent={currentCode || undefined}
            error={currentError || undefined}
            filePath={currentFilePath || undefined}
            onAcceptSuggestion={handleCodeSuggestion}
            onClose={toggleChat}
        />
    );
};

export default ChatBotContainer; 