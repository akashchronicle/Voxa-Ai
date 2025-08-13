"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Code, 
  Coffee,
  Heart,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const skills = [
  "Next.js", "React", "TypeScript", "AI/ML", "Azure", "OpenAI", "Voice Tech", "Full-Stack"
];

const achievements = [
  "Expert in AI integration and scalable software architecture",
  "Proven problem-solver delivering impactful results under pressure",
  "Skilled at turning concepts into production-ready solutions",
  "Recognized for clean, maintainable, high-performance code",
  "Quick to learn and master emerging technologies",
  "Experienced in driving community and product growth"
];


export const DeveloperSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet the Creator
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate developer building the future of AI-powered collaboration
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Developer Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                Akash Jha
                <Sparkles className="h-6 w-6 text-primary" />
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Full-stack developer and AI enthusiast with a passion for creating innovative solutions 
                that bridge the gap between human interaction and artificial intelligence.
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="secondary" className="text-sm">
                  <Code className="h-3 w-3 mr-1" />
                  Full-Stack Developer
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Heart className="h-3 w-3 mr-1" />
                  AI Enthusiast
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Coffee className="h-3 w-3 mr-1" />
                  Problem Solver
                </Badge>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Technologies & Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Badge variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Key Achievements</h4>
              <ul className="space-y-2">
                {achievements.map((achievement, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    {achievement}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="https://github.com/yourusername" target="_blank">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://linkedin.com/in/yourusername" target="_blank">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://twitter.com/yourusername" target="_blank">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="mailto:akash@voxa.ai">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Developer Photo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Card className="relative overflow-hidden border-0 shadow-2xl">
              <CardContent className="p-0">
                                <div className="relative">
                                     {/* Developer photo */}
                                     <img src="/devphoto.png" alt="Akash Jha" className="w-80 h-auto max-h-[500px] object-cover rounded-lg shadow-lg" />
                  
                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-4 left-4 w-6 h-6 bg-chart-2 rounded-full flex items-center justify-center"
                  >
                    <Code className="h-3 w-3 text-white" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-chart-1/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                "To democratize AI-powered collaboration by making intelligent meeting assistants 
                accessible to every team, helping them communicate more effectively and achieve their goals faster."
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}; 