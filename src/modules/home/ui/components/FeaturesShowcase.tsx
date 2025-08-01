"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Mic, 
  MessageSquare, 
  Video, 
  FileText, 
  Users,
  Zap,
  Shield,
  Clock,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Advanced language models that understand context and provide meaningful responses",
    color: "text-primary",
    bgColor: "bg-primary/10",
    badge: "Core Feature"
  },
  {
    icon: Mic,
    title: "Real-Time Voice",
    description: "Natural speech recognition and synthesis for seamless conversations",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    badge: "Live"
  },
  {
    icon: MessageSquare,
    title: "Context Memory",
    description: "Remembers conversation history and maintains context throughout meetings",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    badge: "Smart"
  },
  {
    icon: Video,
    title: "Meeting Integration",
    description: "Seamlessly joins your existing video conferencing platforms",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    badge: "Universal"
  },
  {
    icon: FileText,
    title: "Auto Summaries",
    description: "Generates comprehensive meeting summaries and action items",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    badge: "Productive"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Enhances team dynamics and ensures everyone's voice is heard",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    badge: "Inclusive"
  }
];

const stats = [
  { icon: Zap, value: "99.9%", label: "Uptime", color: "text-primary" },
  { icon: Shield, value: "Enterprise", label: "Security", color: "text-chart-2" },
  { icon: Clock, value: "<100ms", label: "Response Time", color: "text-chart-3" },
  { icon: TrendingUp, value: "10x", label: "Productivity Boost", color: "text-chart-1" }
];

export const FeaturesShowcase = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            Why Choose Voxa AI?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of meeting intelligence with cutting-edge AI that transforms how teams collaborate
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-0 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 to-chart-1/10 rounded-2xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Trusted by Teams Worldwide
            </h3>
            <p className="text-muted-foreground">
              Built for reliability, security, and performance
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`inline-flex p-3 rounded-full bg-white/50 mb-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 