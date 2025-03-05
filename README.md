# CodeChoreo

A real-time collaborative code editor with AI assistance powered by Azure OpenAI.

## Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn
- Azure OpenAI API access

### Setup Steps

1. **Clone and Install**
```bash
# Clone repository
git clone https://github.com/yourusername/CodeChoreo.git
cd CodeChoreo

# Install dependencies for both client and server
cd server && npm install
cd ../client && npm install
```

2. **Environment Setup**

Server (.env in server directory):
```env
# Required: Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=your_azure_endpoint
AZURE_DEPLOYMENT_NAME=your_deployment_name

# Optional: Server Configuration
PORT=5000
```

Client (.env in client directory):
```env
# Required: Server URL
VITE_SERVER_URL=http://localhost:5000
```

3. **Start Development Servers**
```bash
# Start server (in server directory)
npm run dev

# Start client (in client directory)
npm run dev
```

Visit `http://localhost:5173` to start using CodeChoreo.

### Getting Azure OpenAI Access

1. Go to [Azure Portal](https://portal.azure.com)
2. Create an Azure OpenAI resource
3. Get your API key and endpoint from the resource
4. Create a deployment and note the deployment name
5. [Official Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/overview)

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

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'feat: add some feature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file
