"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  VolumeX, 
  RotateCcw, 
  Loader2,
  MessageSquare,
  User,
  Bot,
  AlertCircle,
  ChevronDown,
  Clock,
  Settings,
  Sparkles
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
  const [isStreamAgentActive, setIsStreamAgentActive] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const call = useCall();
  const streamAgentCheckRef = useRef<NodeJS.Timeout | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
        const aiParticipants = call.state.participants.filter(
          participant => participant.userId.includes('ai-') || 
                        participant.userId.includes('agent') ||
                        participant.userId.includes('bot')
        );
        setIsStreamAgentActive(aiParticipants.length > 0);
      }
    };

    checkStreamAgent();
    streamAgentCheckRef.current = setInterval(checkStreamAgent, 2000);

    return () => {
      if (streamAgentCheckRef.current) {
        clearInterval(streamAgentCheckRef.current);
      }
    };
  }, [call]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current && showHistory) {
      setTimeout(() => {
        const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }, 100);
    }
  }, [conversationHistory, lastResponse, showHistory]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
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

  const handleClearHistory = () => {
    clearHistory();
    toast.success('Conversation history cleared');
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
        handleStopSpeaking();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSpeaking]);

  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = () => {
    if (isListening) return 'text-green-600 bg-green-50 border-green-200';
    if (isSpeaking) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (isProcessing) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const getStatusText = () => {
    if (isListening) return 'Listening';
    if (isSpeaking) return 'Speaking';
    if (isProcessing) return 'Processing';
    return 'Ready';
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Compact Header */}
      <div className="flex-shrink-0 p-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Azure Voice Agent</h3>
              <p className="text-xs text-slate-500">AI Assistant</p>
            </div>
          </div>
          <Badge 
            variant="outline"
            className={`px-2 py-1 text-xs font-medium border ${getStatusColor()}`}
          >
            {getStatusText()}
          </Badge>
        </div>

        {/* Stream Agent Warning - Compact */}
        {isStreamAgentActive && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-amber-600" />
              <span className="text-xs font-medium text-amber-800">Stream AI Agent Active</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              Using both agents may cause audio conflicts.
            </p>
          </div>
        )}
      </div>

      {/* Compact Status Indicators */}
      <div className="flex-shrink-0 p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-slate-700">Status</h4>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime()}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className={`flex items-center gap-1 p-1.5 rounded-md border transition-colors ${
            isListening ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-xs font-medium">Listening</span>
          </div>
          
          <div className={`flex items-center gap-1 p-1.5 rounded-md border transition-colors ${
            isSpeaking ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-xs font-medium">Speaking</span>
          </div>
          
          <div className={`flex items-center gap-1 p-1.5 rounded-md border transition-colors ${
            isProcessing ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-xs font-medium">Processing</span>
          </div>
        </div>
      </div>

      {/* Error Display - Compact */}
      {error && (
        <div className="flex-shrink-0 p-3 bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3 w-3 text-red-500" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Compact Controls */}
      <div className="flex-shrink-0 p-3 bg-white border-b border-slate-200">
        <div className="flex gap-2 mb-2">
          <Button
            onClick={handleToggleListening}
            variant={isListening ? "destructive" : "default"}
            size="sm"
            className="flex-1 h-8 font-medium text-xs"
            disabled={isProcessing}
          >
            {isListening ? (
              <>
                <MicOff className="h-3 w-3 mr-1" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-3 w-3 mr-1" />
                Start Listening
              </>
            )}
          </Button>

          <Button
            onClick={handleStopSpeaking}
            variant={isSpeaking ? "destructive" : "outline"}
            size="sm"
            disabled={!isSpeaking}
            className="h-8 w-8 p-0"
            title="Stop AI from speaking"
          >
            <VolumeX className="h-3 w-3" />
          </Button>

          <Button
            onClick={handleClearHistory}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            title="Clear conversation history"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>

        {/* Compact Quick Tips */}
        <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <div className="flex items-center gap-1 mb-1">
            <Settings className="h-3 w-3" />
            <span className="font-medium">Quick Tips</span>
          </div>
          <ul className="space-y-0.5 text-xs">
            <li>• Press <kbd className="px-1 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Esc</kbd> to stop AI speech</li>
            <li>• Talk while AI is speaking to interrupt</li>
            <li>• Use the stop button for immediate halt</li>
          </ul>
        </div>
      </div>

      {/* Live Transcript - Compact */}
      {transcript && (
        <div className="flex-shrink-0 p-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-800">You said:</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-blue-200 shadow-sm">
            <p className="text-xs text-slate-800 leading-relaxed">{transcript}</p>
          </div>
        </div>
      )}

      {/* Processing Indicator - Compact */}
      {isProcessing && (
        <div className="flex-shrink-0 p-3 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
            <div>
              <p className="text-xs font-medium text-amber-800">Processing your request...</p>
              <p className="text-xs text-amber-700">Please wait while I think</p>
            </div>
          </div>
        </div>
      )}

      {/* Interruption Indicator - Compact */}
      {isSpeaking && transcript && (
        <div className="flex-shrink-0 p-3 bg-orange-50 border-b border-orange-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <div>
              <p className="text-xs font-medium text-orange-800">Interrupting AI</p>
              <p className="text-xs text-orange-700">Responding to your new input...</p>
            </div>
          </div>
        </div>
      )}

      {/* Conversation History - Expanded */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-shrink-0 p-3 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-slate-600" />
              <h4 className="text-sm font-medium text-slate-700">Conversation History</h4>
              {conversationHistory.length > 0 && (
                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                  {conversationHistory.length} messages
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="h-6 w-6 p-0 hover:bg-slate-100"
            >
              <ChevronDown className={`h-3 w-3 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>

        {showHistory && (
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
              <div className="p-3 space-y-3">
                {conversationHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-1">No conversation history yet</p>
                    <p className="text-xs text-slate-400">Start talking to see messages here</p>
                  </div>
                ) : (
                  conversationHistory.map((message, index) => (
                    <div key={index} className="flex gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                        message.role === 'user' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-slate-700 capitalize">
                            {message.role === 'user' ? 'You' : 'AI Assistant'}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-2 w-2" />
                            {formatTime()}
                          </span>
                        </div>
                        <div className={`p-2 rounded-lg shadow-sm ${
                          message.role === 'user' 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'bg-green-50 border border-green-200'
                        }`}>
                          <p className="text-xs text-slate-800 leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Last Response (if not in history yet) */}
                {lastResponse && conversationHistory.length === 0 && (
                  <div className="flex gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-700">AI Assistant</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="h-2 w-2" />
                          {formatTime()}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-green-50 border border-green-200 shadow-sm">
                        <p className="text-xs text-slate-800 leading-relaxed">
                          {lastResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}; 