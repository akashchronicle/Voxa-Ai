"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Mic, 
  MessageSquare, 
  Users, 
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useState } from "react";

interface DemoInstructionsProps {
  onStartDemo: () => void;
}

export const DemoInstructions = ({ onStartDemo }: DemoInstructionsProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const quickStartSteps = [
    {
      icon: Mic,
      title: "Enable Microphone",
      description: "Allow browser access to your microphone when prompted"
    },
    {
      icon: MessageSquare,
      title: "Start Conversation",
      description: "Click 'Start Demo' and begin speaking naturally"
    },
    {
      icon: Users,
      title: "Experience AI",
      description: "See how the agent responds and adapts to your conversation"
    }
  ];

  const conversationStarters = [
    "Tell me about your capabilities",
    "How can you help in a meeting?",
    "What makes you different from other AI assistants?",
    "Can you help me brainstorm ideas?",
    "What's your approach to problem-solving?"
  ];

  const tips = [
    "Speak clearly and at a normal pace",
    "You can interrupt the AI while it's speaking",
    "Try different conversation topics",
    "Switch between agents to see different personalities",
    "The AI remembers context throughout the conversation"
  ];

  return (
    <div className="space-y-6">
      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>
            Get started with the AI agent demo in just 3 simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {quickStartSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button onClick={onStartDemo} className="w-full" size="lg">
            <Mic className="h-4 w-4 mr-2" />
            Start Demo Now
          </Button>
        </CardContent>
      </Card>

      {/* Conversation Starters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Conversation Starters
          </CardTitle>
          <CardDescription>
            Try these prompts to get the conversation flowing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {conversationStarters.map((starter, index) => (
              <div
                key={index}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => {
                  // You could implement a way to auto-fill or suggest these
                  console.log("Suggested prompt:", starter);
                }}
              >
                <p className="text-sm text-blue-800">"{starter}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips & Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Tips & Best Practices
          </CardTitle>
          <CardDescription>
            Make the most of your demo experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-purple-500" />
            Advanced Features
            <Badge variant="secondary" className="ml-auto">Pro Tips</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-sm mb-2 text-purple-800">Voice Interruption</h4>
              <p className="text-xs text-purple-700 mb-3">
                You can interrupt the AI while it's speaking by starting to talk again. This creates a more natural conversation flow.
              </p>
              <div className="flex items-center gap-2 text-xs text-purple-600">
                <AlertCircle className="h-3 w-3" />
                <span>Try saying "stop" or "wait" to interrupt</span>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-sm mb-2 text-orange-800">Context Memory</h4>
              <p className="text-xs text-orange-700">
                The AI remembers your conversation context. You can refer back to previous topics and the agent will understand the connection.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              {showAdvanced ? "Hide" : "Show"} Technical Details
            </Button>

            {showAdvanced && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                <div>
                  <h5 className="font-medium text-xs mb-1">Speech Recognition</h5>
                  <p className="text-xs text-gray-600">
                    Uses Azure Speech Services for real-time speech-to-text conversion with high accuracy.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-xs mb-1">AI Processing</h5>
                  <p className="text-xs text-gray-600">
                    Powered by Azure OpenAI for natural language understanding and response generation.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-xs mb-1">Voice Synthesis</h5>
                  <p className="text-xs text-gray-600">
                    Converts AI responses back to speech using Azure's neural voice technology.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 