# CodeChoreo

CodeChoreo is an real-time collaborative code editor with integrated AI assistance, designed to enhance the coding experience with real-time suggestions, error analysis, and context-aware code completion.

## Features

### 🤖 AI Code Assistant
- Real-time code suggestions and improvements
- Context-aware responses based on current file and workspace
- Error analysis and solution recommendations
- Interactive chat interface with editable messages
- Code snippet suggestions with one-click application

### 📝 Code Editor
- Syntax highlighting
- Multiple file support
- File system navigation
- Real-time error detection
- Output console integration

### 💻 User Interface
- Resizable chat window
- Dark theme optimized for coding
- Intuitive file management
- Dynamic chat bubbles with markdown support
- Easy-to-use suggestion acceptance/rejection

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A valid Azure OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/CodeChoreo.git
cd CodeChoreo
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# In server directory
cp .env.example .env

# In client directory
cp .env.example .env
```

Configure the following environment variables:
- Server: `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT`
- Client: `VITE_SERVER_URL`

4. Start the development servers
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm run dev
```

## Acknowledgments

- Built with React and TypeScript
- Powered by Azure OpenAI
- UI components using Tailwind CSS
