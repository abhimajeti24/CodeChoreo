import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAppContext } from './AppContext';

interface ChatBotContextType {
    isOpen: boolean;
    toggleChat: () => void;
    currentCode: string | null;
    setCurrentCode: (code: string | null) => void;
    currentError: string | null;
    setCurrentError: (error: string | null) => void;
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
    const { currentUser } = useAppContext();

    // Reset chat state when user changes
    useEffect(() => {
        setCurrentCode(null);
        setCurrentError(null);
        setIsOpen(false);
    }, [currentUser?.username]);

    const toggleChat = () => {
        setIsOpen(prev => !prev);
    };

    const value = {
        isOpen,
        toggleChat,
        currentCode,
        setCurrentCode,
        currentError,
        setCurrentError,
    };

    return (
        <ChatBotContext.Provider value={value}>
            {children}
        </ChatBotContext.Provider>
    );
}; 