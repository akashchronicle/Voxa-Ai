import { VoiceAgentPanel } from '@/components/voice-agent/VoiceAgentPanel';

export default function VoiceAgentDemoPage() {
  const demoInstructions = `You are a helpful AI assistant for meetings. You should:
- Listen carefully to what people are saying
- Provide concise, relevant responses
- Help with meeting facilitation and note-taking
- Ask clarifying questions when needed
- Be professional and supportive

Keep your responses under 2 sentences and focus on being helpful.`;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Azure Voice Agent Demo</h1>
          <p className="text-muted-foreground">
            Test the real-time voice agent using Azure Speech Services and Azure OpenAI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Agent Panel */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Voice Agent</h2>
            <VoiceAgentPanel agentInstructions={demoInstructions} />
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">How to Test</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Click "Start Listening" to activate the microphone</li>
                <li>Speak clearly into your microphone</li>
                <li>The agent will transcribe your speech and respond</li>
                <li>You can stop listening or speaking at any time</li>
                <li>Clear the conversation history to start fresh</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                <li>Microphone access in your browser</li>
                <li>Azure Speech Services configured</li>
                <li>Azure OpenAI configured</li>
                <li>Environment variables set up</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold mb-3 text-yellow-800">Troubleshooting</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                <li>Check browser microphone permissions</li>
                <li>Verify Azure Speech key and region</li>
                <li>Ensure Azure OpenAI is properly configured</li>
                <li>Check browser console for errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 