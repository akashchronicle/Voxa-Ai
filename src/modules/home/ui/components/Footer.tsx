"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  MessageSquare,
  Heart,
  Send
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { name: "Features", href: "#features" },
  { name: "Demo", href: "/demo" },
  { name: "Documentation", href: "/docs" },
  { name: "Support", href: "/support" }
];

const company = [
  { name: "About Us", href: "/about" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Contact", href: "/contact" }
];

const socialLinks = [
  { icon: Github, href: "https://github.com/voxa-ai", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/company/voxa-ai", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/voxa_ai", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@voxa.ai", label: "Email" }
];

export const Footer = () => {
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Feedback submitted");
  };

  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t">
      <div className="container mx-auto px-6 py-16">
 {/* Feedback Section */}
 <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
                     <Card className="bg-gradient-to-r from-primary/5 to-chart-1/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Share Your Feedback
              </CardTitle>
              <CardDescription>
                Help us improve Voxa AI by sharing your thoughts and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your name" />
                  <Input placeholder="Your email" type="email" />
                </div>
                <Textarea 
                  placeholder="Tell us what you think about Voxa AI..." 
                  rows={4}
                />
                <div className="flex items-center gap-4">
                  <Button type="submit" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Feedback
                  </Button>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>We love hearing from you!</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>



        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logoVox.png" height={40} width={40} alt="Voxa AI" />
              <span className="text-xl font-bold">Voxa AI</span>
            </div>
            <p className="text-muted-foreground mb-4">
              The Voice in the Call That Never Forgets. 
              Transform your meetings with AI-powered intelligence.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-10 h-10 p-0"
                >
                  <Link href={social.href} target="_blank">
                    <social.icon className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>hello@voxa.ai</p>
              <p>support@voxa.ai</p>
              <p>Available 24/7</p>
            </div>
          </div>
        </div>

       

        {/* Bottom Bar */}
        <div className="border-t pt-8 pl-30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 Voxa AI. All rights reserved. Made with ❤️ by Akash Jha
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}; 