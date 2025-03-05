import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Toast from "./components/toast/Toast"
import EditorPage from "./pages/EditorPage"
import HomePage from "./pages/HomePage"
import { ChatBotProvider } from "./context/ChatBotContext"
import ChatBotContainer from "./components/ChatBot/ChatBotContainer"
import ChatBotToggle from "./components/ChatBot/ChatBotToggle"
import { AppContextProvider } from "./context/AppContext"
import { SocketProvider } from "./context/SocketContext"
import { useEffect } from "react"
import EditorChatBotContainer from "./components/ChatBot/EditorChatBotContainer"

const App = () => {
    useEffect(() => {
        // Generate a unique user ID if not exists
        if (!localStorage.getItem('userId')) {
            const userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
        }
    }, []);

    return (
        <AppContextProvider>
            <SocketProvider>
                <ChatBotProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={
                                <>
                                    <HomePage />
                                    <ChatBotContainer />
                                </>
                            } />
                            <Route path="/editor/:roomId" element={
                                <>
                                    <EditorPage />
                                    <EditorChatBotContainer />
                                </>
                            } />
                        </Routes>
                        <Toast />
                        <ChatBotToggle />
                    </Router>
                </ChatBotProvider>
            </SocketProvider>
        </AppContextProvider>
    )
}

export default App
