import React from 'react';
import { useChatBot } from '@/context/ChatBotContext';
import ChatBot from './ChatBot';
import { useParams } from 'react-router-dom';

const EditorChatBotContainer: React.FC = () => {
    const { isOpen, toggleChat, currentCode, currentError, currentFilePath } = useChatBot();
    const { roomId } = useParams();

    if (!isOpen) return null;

    return (
        <ChatBot
            codeContent={currentCode || undefined}
            error={currentError || undefined}
            filePath={currentFilePath || undefined}
            roomId={roomId || 'default'}
            onClose={toggleChat}
            onAcceptSuggestion={(suggestion) => {
                // Handle suggestion acceptance
                console.log('Suggestion accepted:', suggestion);
            }}
        />
    );
};

export default EditorChatBotContainer; 