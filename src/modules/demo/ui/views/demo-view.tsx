"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceAgentPanel } from "@/components/voice-agent/VoiceAgentPanel";
import { DemoInstructions } from "../components/demo-instructions";
import { DemoAnalytics } from "../components/demo-analytics";
import { 
  Bot, 
  MessageSquare, 
  Mic, 
  Sparkles, 
  Users, 
  Brain, 
  Coffee,
  GraduationCap,
  Briefcase,
  Heart,
  Play,
  BookOpen
} from "lucide-react";
import Link from "next/link";

interface AgentPersonality {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  instructions: string;
  color: string;
  badge: string;
}

const agentPersonalities: AgentPersonality[] = [
  {
    id: "meeting-facilitator",
    name: "Meeting Facilitator",
    description: "Perfect for keeping meetings on track and ensuring everyone's voice is heard",
    icon: Users,
    instructions: `You are an expert meeting facilitator. Your role is to:
- Keep meetings organized and on track
- Ensure all participants have a chance to speak
- Summarize key points and action items
- Ask clarifying questions when needed
- Help resolve conflicts and maintain focus
- Take notes and provide meeting summaries

Be professional, inclusive, and efficient. Keep responses concise and actionable.`,
    color: "bg-blue-500",
    badge: "Professional"
  },
  {
    id: "creative-brainstormer",
    name: "Creative Brainstormer",
    description: "Ideal for ideation sessions and creative problem-solving",
    icon: Sparkles,
    instructions: `You are a creative brainstorming partner. Your role is to:
- Generate innovative ideas and solutions
- Ask thought-provoking questions
- Build upon others' ideas constructively
- Encourage out-of-the-box thinking
- Help organize and categorize ideas
- Maintain positive energy and enthusiasm

Be imaginative, supportive, and open to all possibilities. Encourage creative exploration.`,
    color: "bg-purple-500",
    badge: "Creative"
  },
  {
    id: "learning-assistant",
    name: "Learning Assistant",
    description: "Great for educational sessions and knowledge sharing",
    icon: GraduationCap,
    instructions: `You are a knowledgeable learning assistant. Your role is to:
- Explain complex concepts clearly
- Provide relevant examples and analogies
- Ask questions to check understanding
- Offer additional resources when helpful
- Encourage active learning and participation
- Adapt explanations to different learning styles

Be patient, encouraging, and educational. Focus on helping people learn and grow.`,
    color: "bg-green-500",
    badge: "Educational"
  },
  {
    id: "business-advisor",
    name: "Business Advisor",
    description: "Perfect for strategic discussions and business planning",
    icon: Briefcase,
    instructions: `You are a strategic business advisor. Your role is to:
- Provide strategic insights and analysis
- Help identify opportunities and risks
- Ask probing questions about business goals
- Offer data-driven recommendations
- Help prioritize initiatives and resources
- Facilitate decision-making processes

Be analytical, strategic, and results-oriented. Focus on business value and outcomes.`,
    color: "bg-orange-500",
    badge: "Strategic"
  },
  {
    id: "wellness-coach",
    name: "Wellness Coach",
    description: "Ideal for health, wellness, and work-life balance discussions",
    icon: Heart,
    instructions: `You are a supportive wellness coach. Your role is to:
- Encourage healthy habits and practices
- Provide gentle guidance and support
- Help identify stress triggers and solutions
- Promote work-life balance
- Offer practical wellness tips
- Create a safe, non-judgmental space

Be empathetic, supportive, and health-focused. Prioritize well-being and balance.`,
    color: "bg-pink-500",
    badge: "Wellness"
  }
];

export const DemoView = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentPersonality>(agentPersonalities[0]);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [activeTab, setActiveTab] = useState("demo");

  const handleAgentSelect = (agent: AgentPersonality) => {
    setSelectedAgent(agent);
    setIsDemoActive(false);
  };

  const handleStartDemo = () => {
    setIsDemoActive(true);
    setActiveTab("demo");
  };

  const handleStopDemo = () => {
    setIsDemoActive(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-white">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Try Our AI Agents</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience how our AI agents can enhance your meetings. Choose a personality and start a conversation to see the magic in action.
        </p>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="demo" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Live Demo
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            How to Use
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Choose Your Agent
                  </CardTitle>
                  <CardDescription>
                    Select an AI personality that matches your needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agentPersonalities.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedAgent.id === agent.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleAgentSelect(agent)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${agent.color} text-white`}>
                          <agent.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{agent.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {agent.badge}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {agent.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Demo Controls */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Demo Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Selected Agent:</h4>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <div className={`p-2 rounded-lg ${selectedAgent.color} text-white`}>
                        <selectedAgent.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{selectedAgent.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedAgent.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleStartDemo}
                      disabled={isDemoActive}
                      className="flex-1"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Start Demo
                    </Button>
                    <Button
                      onClick={handleStopDemo}
                      variant="outline"
                      disabled={!isDemoActive}
                    >
                      Stop Demo
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium mb-1">💡 Demo Tips:</p>
                    <ul className="space-y-1">
                      <li>• Speak clearly into your microphone</li>
                      <li>• Try asking questions or sharing ideas</li>
                      <li>• Experience how the agent responds</li>
                      <li>• Switch agents to see different personalities</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Voice Agent Demo */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${selectedAgent.color} text-white`}>
                      <selectedAgent.icon className="h-5 w-5" />
                    </div>
                    {selectedAgent.name} Demo
                  </CardTitle>
                  <CardDescription>
                    {selectedAgent.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isDemoActive ? (
                    <VoiceAgentPanel 
                      agentInstructions={selectedAgent.instructions}
                      onAgentResponse={(response) => {
                        console.log("Agent response:", response);
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                      <div className={`p-4 rounded-full ${selectedAgent.color} text-white`}>
                        <selectedAgent.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Ready to meet {selectedAgent.name}?</h3>
                        <p className="text-muted-foreground mb-4">
                          Click "Start Demo" to begin your conversation with this AI agent.
                        </p>
                        <Button onClick={handleStartDemo} size="lg">
                          <Mic className="h-4 w-4 mr-2" />
                          Start Demo
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <DemoInstructions onStartDemo={handleStartDemo} />
          <DemoAnalytics />
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to create your own AI agent?</h3>
          <p className="text-muted-foreground mb-4">
            Now that you've experienced our AI agents, create your own custom agent for your specific needs.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="default" size="lg" asChild>
              <Link href="/agents">
                <Bot className="h-4 w-4 mr-2" />
                Create Your Agent
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/meetings">
                <Coffee className="h-4 w-4 mr-2" />
                Schedule a Meeting
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 