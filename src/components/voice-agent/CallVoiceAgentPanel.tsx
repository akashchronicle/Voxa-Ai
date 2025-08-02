"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  Bot,
  AlertCircle
} from 'lucide-react';
import { useAzureVoiceAgent } from '@/hooks/useAzureVoiceAgent';
import { toast } from 'sonner';
import { useCall } from '@stream-io/video-react-sdk';

interface CallVoiceAgentPanelProps {
  agentInstructions: string;
  onAgentResponse?: (response: string) => void;
}

export const CallVoiceAgentPanel: React.FC<CallVoiceAgentPanelProps> = ({
  agentInstructions,
  onAgentResponse
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isStreamAgentActive, setIsStreamAgentActive] = useState(false);
  const call = useCall();
  const streamAgentCheckRef = useRef<NodeJS.Timeout | null>(null);

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

  // Check if Stream Video's built-in agent is active
  useEffect(() => {
    const checkStreamAgent = () => {
      if (call) {
        // Check if there are any AI participants in the call
        const aiParticipants = call.state.participants.filter(
          participant => participant.userId.includes('ai-') || 
                        participant.userId.includes('agent') ||
                        participant.userId.includes('bot')
        );
        setIsStreamAgentActive(aiParticipants.length > 0);
      }
    };

    // Check immediately
    checkStreamAgent();

    // Set up periodic checking
    streamAgentCheckRef.current = setInterval(checkStreamAgent, 2000);

    return () => {
      if (streamAgentCheckRef.current) {
        clearInterval(streamAgentCheckRef.current);
      }
    };
  }, [call]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      // Check if Stream agent is active and warn user
      if (isStreamAgentActive) {
        toast.warning('Stream Video AI agent is already active. Consider using one agent at a time to avoid conflicts.');
      }
      startListening();
    }
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    toast.success('AI speech stopped');
  };

  const handleStopSpeakingWithFeedback = () => {
    // Add visual feedback
    const button = document.querySelector('[title="Stop AI from speaking"]') as HTMLButtonElement;
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }
    handleStopSpeaking();
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

  // Add keyboard shortcut for stopping speech
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSpeaking) {
        handleStopSpeakingWithFeedback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSpeaking, handleStopSpeakingWithFeedback]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Azure Voice Agent
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stream Agent Warning */}
        {isStreamAgentActive && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Stream AI Agent Active</span>
            </div>
            <p className="text-xs text-yellow-700">
              Stream Video's built-in AI agent is running. Using both agents simultaneously may cause audio conflicts.
            </p>
          </div>
        )}

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
            onClick={handleStopSpeakingWithFeedback}
            variant={isSpeaking ? "destructive" : "outline"}
            size="sm"
            disabled={!isSpeaking}
            className="flex-shrink-0 transition-transform"
            title="Stop AI from speaking"
          >
            <VolumeX className="h-4 w-4" />
            {isSpeaking && <span className="ml-1 text-xs">Stop</span>}
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
          <p><strong>Stop:</strong> Use the volume button or press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> to immediately stop AI from speaking.</p>
          <p><strong>Note:</strong> The stop button will immediately halt any ongoing speech.</p>
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

        {/* Speech Stopping Indicator */}
        {!isSpeaking && isProcessing && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
            <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm">Processing your request...</span>
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