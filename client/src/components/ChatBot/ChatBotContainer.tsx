import React from 'react';
import { useChatBot } from '@/context/ChatBotContext';
import ChatBot from './ChatBot';

const ChatBotContainer: React.FC = () => {
    const { isOpen, toggleChat, currentCode, currentError, currentFilePath } = useChatBot();

    if (!isOpen) return null;

    return (
        <ChatBot
            codeContent={currentCode || undefined}
            error={currentError || undefined}
            filePath={currentFilePath || undefined}
            roomId="default"
            onClose={toggleChat}
            onAcceptSuggestion={(suggestion) => {
                // Handle suggestion acceptance
                console.log('Suggestion accepted:', suggestion);
            }}
        />
    );
};

export default ChatBotContainer; 