import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import GitHubCorner from "./components/GitHubCorner"
import Toast from "./components/toast/Toast"
import EditorPage from "./pages/EditorPage"
import HomePage from "./pages/HomePage"
import { ChatBotProvider } from "./context/ChatBotContext"
import ChatBotContainer from "./components/ChatBot/ChatBotContainer"
import ChatBotToggle from "./components/ChatBot/ChatBotToggle"
import { AppContextProvider } from "./context/AppContext"
import { SocketProvider } from "./context/SocketContext"

const App = () => {
    return (
        <AppContextProvider>
            <SocketProvider>
                <ChatBotProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/editor/:roomId" element={<EditorPage />} />
                        </Routes>
                    </Router>
                    <Toast /> {/* Toast component from react-hot-toast */}
                    <GitHubCorner />
                    <ChatBotContainer />
                    <ChatBotToggle />
                </ChatBotProvider>
            </SocketProvider>
        </AppContextProvider>
    )
}

export default App
