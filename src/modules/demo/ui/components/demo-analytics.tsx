"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Clock, 
  MessageSquare,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface DemoStats {
  totalDemos: number;
  activeAgents: number;
  avgSessionTime: number;
  popularAgent: string;
  conversionRate: number;
}

export const DemoAnalytics = () => {
  const [stats, setStats] = useState<DemoStats>({
    totalDemos: 1247,
    activeAgents: 5,
    avgSessionTime: 4.2,
    popularAgent: "Meeting Facilitator",
    conversionRate: 23.5
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const statCards = [
    {
      icon: Users,
      title: "Total Demos",
      value: stats.totalDemos.toLocaleString(),
      description: "People who tried our AI agents",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Clock,
      title: "Avg. Session",
      value: `${stats.avgSessionTime} min`,
      description: "Average time spent with agents",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: MessageSquare,
      title: "Popular Agent",
      value: stats.popularAgent,
      description: "Most tried agent personality",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: TrendingUp,
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      description: "Demo to signup conversion",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  if (!isVisible) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-2 border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Demo Insights
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </CardTitle>
        <CardDescription>
          See how others are experiencing our AI agents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-lg transition-all hover:scale-105"
            >
              <div className={`inline-flex p-2 rounded-lg ${stat.bgColor} mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Why people love our demo:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div>✨ "The voice interaction feels so natural"</div>
            <div>🚀 "I can see exactly how it would help in meetings"</div>
            <div>💡 "Different agent personalities are brilliant"</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 