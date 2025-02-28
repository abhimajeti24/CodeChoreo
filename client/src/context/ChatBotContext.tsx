import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { useFileSystem } from './FileContext';

interface ChatBotContextType {
    isOpen: boolean;
    toggleChat: () => void;
    currentCode: string | null;
    setCurrentCode: (code: string | null) => void;
    currentError: string | null;
    setCurrentError: (error: string | null) => void;
    currentFilePath: string | null;
    setCurrentFilePath: (path: string | null) => void;
    handleCodeSuggestion: (suggestion: string) => void;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export const useChatBot = () => {
    const context = useContext(ChatBotContext);
    if (!context) {
        throw new Error('useChatBot must be used within a ChatBotProvider');
    }
    return context;
};

interface ChatBotProviderProps {
    children: ReactNode;
}

export const ChatBotProvider: React.FC<ChatBotProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentCode, setCurrentCode] = useState<string | null>(null);
    const [currentError, setCurrentError] = useState<string | null>(null);
    const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
    const { currentUser } = useAppContext();
    const { activeFile, setActiveFile, updateFileContent } = useFileSystem();

    // Reset chat state when user changes
    useEffect(() => {
        setCurrentCode(null);
        setCurrentError(null);
        setCurrentFilePath(null);
        setIsOpen(false);
    }, [currentUser?.username]);

    const toggleChat = () => {
        setIsOpen(prev => !prev);
    };

    const handleCodeSuggestion = (suggestion: string) => {
        if (!activeFile) return;

        // Append the suggestion to the existing content
        const existingContent = activeFile.content;
        const updatedContent = existingContent + '\n\n' + suggestion;

        // Update the file content
        const updatedFile = {
            ...activeFile,
            content: updatedContent
        };

        // Update the active file
        setActiveFile(updatedFile);

        // Update the file in the file system
        updateFileContent(activeFile.id, updatedContent);

        // Update the current code in the chat context
        setCurrentCode(updatedContent);
    };

    const value = {
        isOpen,
        toggleChat,
        currentCode,
        setCurrentCode,
        currentError,
        setCurrentError,
        currentFilePath,
        setCurrentFilePath,
        handleCodeSuggestion,
    };

    return (
        <ChatBotContext.Provider value={value}>
            {children}
        </ChatBotContext.Provider>
    );
}; 