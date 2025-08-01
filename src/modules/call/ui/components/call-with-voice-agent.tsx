"use client";

import React, { useState } from 'react';
import { VoiceAgentPanel } from '@/components/voice-agent/VoiceAgentPanel';
import { CallLobby } from './call-lobby';
import { CallActive } from './call-active';
import { CallEnded } from './call-ended';
import { CallConnect } from './call-connect';
import { CallProvider } from './call-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Mic, MicOff } from 'lucide-react';

interface CallWithVoiceAgentProps {
  meetingId: string;
  agentInstructions: string;
  onAgentResponse?: (response: string) => void;
}

export const CallWithVoiceAgent: React.FC<CallWithVoiceAgentProps> = ({
  meetingId,
  agentInstructions,
  onAgentResponse
}) => {
  const [showVoiceAgent, setShowVoiceAgent] = useState(false);
  const [agentResponses, setAgentResponses] = useState<string[]>([]);

  const handleAgentResponse = (response: string) => {
    setAgentResponses(prev => [...prev, response]);
    if (onAgentResponse) {
      onAgentResponse(response);
    }
  };

  return (
    <CallProvider meetingId={meetingId}>
      <div className="flex h-screen">
        {/* Main Call Interface */}
        <div className="flex-1 flex flex-col">
          <CallConnect>
            {({ call, participants, localParticipant, isConnecting, error }) => {
              if (isConnecting) {
                return (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Connecting to call...</p>
                    </div>
                  </div>
                );
              }

              if (error) {
                return (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-red-600 mb-4">Connection error: {error}</p>
                      <Button onClick={() => window.location.reload()}>
                        Retry Connection
                      </Button>
                    </div>
                  </div>
                );
              }

              if (!call) {
                return <CallLobby onJoin={() => {}} />;
              }

              return (
                <div className="flex h-full">
                  {/* Call Interface */}
                  <div className="flex-1">
                    <CallActive
                      call={call}
                      participants={participants}
                      localParticipant={localParticipant}
                    />
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
                            onClick={() => setShowVoiceAgent(!showVoiceAgent)}
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
                          <VoiceAgentPanel
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
            }}
          </CallConnect>
        </div>
      </div>
    </CallProvider>
  );
}; 