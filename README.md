# CodeChoreo

A real-time collaborative code editor with AI assistance 

## Quick Start

### Prerequisites
- Node.js 14+
- npm
- Github Access Token(for accessing the openai gpt-4o model)

### Setup Steps

1. **Clone and Install**
```bash
# Clone repository
git clone https://github.com/yourusername/CodeChoreo.git
cd CodeChoreo

# Install dependencies
#Server
cd server
npm install

#Client
cd client
npm install
```

2. **Environment Setup**

Create a .env in the server directory:
```env
# Required: Personal Github Access Token for authenticating with the model
GITHUHB_TOKEN=your_azure_openai_api_key


# Optional: Server Configuration
PORT=5000
```

Create a .env in the client directory:
```env
# Required: Server URL
VITE_SERVER_URL=http://localhost:5000
```

3. **Start Development Servers**
```bash
# Start server (in server directory)
cd server
npm run dev

# Start client (in client directory)
cd client
npm run dev
```

Visit `http://localhost:5173` to start using CodeChoreo.

### Getting Github Access Token

1. Go to [Github Developer Settings](https://github.com/settings/tokens)
2. Create an Personal Access Token(classic)
3. Copy the token
4. Paste the token in the .env file

Reference: [Github Marketplace](https://github.com/marketplace/models/azure-openai/gpt-4o/playground)

## Features

### Real-time Collaboration
- Multiple users can edit code simultaneously
- Live cursor tracking
- Real-time chat between users

### AI Code Assistant
- Context-aware code suggestions
- Error analysis and solutions
- Code explanations and improvements
- Room-specific chat history

### Code Editor
- Syntax highlighting
- Multiple file support
- Error detection
- Output console
- File system navigation

## Troubleshooting

### Common Issues

1. **Server Connection Error**
   - Check if server is running on port 5000
   - Verify VITE_SERVER_URL in client .env

2. **AI Assistant Not Working**
   - Verify Azure OpenAI credentials
   - Check deployment name matches your Azure setup

3. **Port Conflicts**
   - Server: Change PORT in .env
   - Client: Edit vite.config.ts port

