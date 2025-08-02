"use client";

import React, { useState, useCallback } from 'react';
import { CallVoiceAgentPanel } from '@/components/voice-agent/CallVoiceAgentPanel';
import { CallLobby } from './call-lobby';
import { CallActive } from './call-active';
import { CallEnded } from './call-ended';
import { CallProvider } from './call-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Mic, MicOff } from 'lucide-react';
import { useCall } from '@stream-io/video-react-sdk';

interface CallWithVoiceAgentProps {
  meetingId: string;
  meetingName: string;
  agentInstructions: string;
  onAgentResponse?: (response: string) => void;
}

export const CallWithVoiceAgent: React.FC<CallWithVoiceAgentProps> = ({
  meetingId,
  meetingName,
  agentInstructions,
  onAgentResponse
}) => {
  return (
    <CallProvider 
      meetingId={meetingId}
      meetingName={meetingName}
      agentInstructions={agentInstructions}
    />
  );
};

// Enhanced CallUI component with voice agent functionality
interface EnhancedCallUIProps {
  meetingName: string;
  agentInstructions: string;
  onAgentResponse?: (response: string) => void;
}

export const EnhancedCallUI: React.FC<EnhancedCallUIProps> = ({
  meetingName,
  agentInstructions,
  onAgentResponse
}) => {
  const call = useCall();
  const [showVoiceAgent, setShowVoiceAgent] = useState(false);
  const [agentResponses, setAgentResponses] = useState<string[]>([]);
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

  const handleJoin = async () => {
    if (!call) return;
    await call.join();
    setShow("call");
  };

  const handleLeave = () => {
    if (!call) return;
    call.endCall();
    setShow("ended");
  };

  const handleAgentResponse = useCallback((response: string) => {
    setAgentResponses(prev => [...prev, response]);
    if (onAgentResponse) {
      onAgentResponse(response);
    }
  }, [onAgentResponse]);

  const toggleVoiceAgent = useCallback(() => {
    setShowVoiceAgent(prev => !prev);
  }, []);

  if (show === "lobby") {
    return <CallLobby onJoin={handleJoin} />;
  }

  if (show === "ended") {
    return <CallEnded />;
  }

  return (
    <div className="flex h-full">
      {/* Main Call Interface */}
      <div className="flex-1">
        <CallActive onLeave={handleLeave} meetingName={meetingName} />
      </div>

      {/* Voice Agent Sidebar */}
      <div className="w-80 border-l border-border bg-background">
        <Card className="h-full rounded-none border-l-0 border-t-0 border-b-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoiceAgent}
              >
                {showVoiceAgent ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <Badge variant={showVoiceAgent ? "default" : "secondary"}>
              {showVoiceAgent ? "Voice Agent Active" : "Voice Agent Inactive"}
            </Badge>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden">
            {showVoiceAgent ? (
              <CallVoiceAgentPanel
                agentInstructions={agentInstructions}
                onAgentResponse={handleAgentResponse}
              />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  Click the microphone button to activate the voice agent
                </p>
              </div>
            )}

            {/* Agent Response History */}
            {agentResponses.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Recent Responses</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {agentResponses.slice(-3).map((response, index) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded">
                      {response}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 