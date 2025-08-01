# Environment Variables Setup for Azure Voice Agent

## Required Environment Variables

Add these variables to your `.env.local` file:

### Azure Speech Services
```bash
NEXT_PUBLIC_AZURE_SPEECH_KEY="your-azure-speech-key"
NEXT_PUBLIC_AZURE_SPEECH_REGION="your-azure-speech-region"
```

### Azure OpenAI (for Voice Agent)
```bash
NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
NEXT_PUBLIC_AZURE_OPENAI_KEY="your-azure-openai-key"
NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT="your-deployment-name"
```

## How to Get Azure Speech Services

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new "Speech Service" resource
3. Choose your region and pricing tier
4. After creation, go to "Keys and Endpoint"
5. Copy Key 1 and Region

## Example .env.local
```bash
# Database
DATABASE_URL="your-database-url"

# Authentication
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Azure OpenAI
AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
AZURE_OPENAI_KEY="your-azure-openai-key"
AZURE_OPENAI_DEPLOYMENT="your-deployment-name"
AZURE_OPENAI_API_VERSION="2024-02-15-preview"

# Azure Speech Services (for Voice Agent)
NEXT_PUBLIC_AZURE_SPEECH_KEY="your-azure-speech-key"
NEXT_PUBLIC_AZURE_SPEECH_REGION="your-azure-speech-region"
NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
NEXT_PUBLIC_AZURE_OPENAI_KEY="your-azure-openai-key"
NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT="your-deployment-name"

# Stream Video
STREAM_API_KEY="your-stream-api-key"
STREAM_API_SECRET="your-stream-api-secret"

# Stream Chat
STREAM_CHAT_API_KEY="your-stream-chat-api-key"
STREAM_CHAT_API_SECRET="your-stream-chat-api-secret"
``` 