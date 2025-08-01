"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Loader2,
  MessageSquare,
  User,
  Bot
} from 'lucide-react';
import { useAzureVoiceAgent } from '@/hooks/useAzureVoiceAgent';

interface VoiceAgentPanelProps {
  agentInstructions: string;
  onAgentResponse?: (response: string) => void;
}

export const VoiceAgentPanel: React.FC<VoiceAgentPanelProps> = ({
  agentInstructions,
  onAgentResponse
}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const {
    isListening,
    isSpeaking,
    isProcessing,
    transcript,
    lastResponse,
    error,
    startListening,
    stopListening,
    stopSpeaking,
    clearHistory,
    conversationHistory
  } = useAzureVoiceAgent({
    speechKey: process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '',
    speechRegion: process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '',
    openAiEndpoint: process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT || '',
    openAiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY || '',
    openAiDeployment: process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT || '',
    agentInstructions,
  });

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
  };

  const handleClearHistory = () => {
    clearHistory();
  };

  // Notify parent component of agent responses
  React.useEffect(() => {
    if (lastResponse && onAgentResponse) {
      onAgentResponse(lastResponse);
    }
  }, [lastResponse, onAgentResponse]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Voice Agent
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Indicators */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-sm">Listening</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-sm">Speaking</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-sm">Processing</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={handleToggleListening}
            variant={isListening ? "destructive" : "default"}
            size="sm"
            className="flex-1"
            disabled={isProcessing}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Listening
              </>
            )}
          </Button>

          <Button
            onClick={handleStopSpeaking}
            variant="outline"
            size="sm"
            disabled={!isSpeaking}
            className="flex-shrink-0"
          >
            <VolumeX className="h-4 w-4" />
          </Button>

          <Button
            onClick={handleClearHistory}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          <p><strong>Tip:</strong> You can interrupt the AI while it's speaking by talking again.</p>
          <p><strong>Stop:</strong> Use the volume button to stop AI from speaking.</p>
        </div>

        {/* Live Transcript */}
        {transcript && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">You:</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm">{transcript}</p>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-md">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Processing your request...</span>
          </div>
        )}

        {/* Interruption Indicator */}
        {isSpeaking && transcript && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-md">
            <div className="h-4 w-4 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-sm">Interrupting AI to respond to your new input...</span>
          </div>
        )}

        {/* Last Response */}
        {lastResponse && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Agent:</span>
            </div>
            <div className="p-3 bg-green-50 rounded-md">
              <p className="text-sm">{lastResponse}</p>
            </div>
          </div>
        )}

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Conversation History</span>
            </div>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {conversationHistory.map((message, index) => (
                  <div key={index} className="text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      {message.role === 'user' ? (
                        <User className="h-3 w-3 text-blue-500" />
                      ) : (
                        <Bot className="h-3 w-3 text-green-500" />
                      )}
                      <span className="font-medium capitalize">{message.role}:</span>
                    </div>
                    <p className="pl-4 text-gray-600">{message.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 