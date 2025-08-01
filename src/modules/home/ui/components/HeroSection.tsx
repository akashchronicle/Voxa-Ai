import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Bot } from "lucide-react";
import Link from "next/link";

const features = [
  "🎧 Listening",
  "🗣️ Speaking",
  "📹 Recording",
  "📝 Summarizing",
];


const HeroSection = () => (
  <section className="relative w-full pt-2 md:pt-2 pb-5 px-4 md:px-10 bg-background text-foreground overflow-hidden">
    {/* Tagline - Billboard Style */}
    

    <div className="flex flex-col md:flex-row items-center justify-between gap-12 pl-10">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl text-left z-10">
        <motion.h1
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-snug"
          >
          Your AI Teammate in <br />Every Meeting
          
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground mt-6 mb-8 max-w-xl leading-relaxed"
        >
          Experience real-time voice intelligence that listens, speaks, and summarizes — just like a human.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
          className="flex flex-wrap gap-4"
        >
          {features.map((feature) => (
            <div
              key={feature}
              className="text-sm md:text-base font-medium px-5 py-3 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-shadow shadow-sm"
            >
              {feature}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/demo">
              <Play className="h-5 w-5 mr-2" />
              Try AI Agent Demo
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/agents">
              <Bot className="h-5 w-5 mr-2" />
              Create Your Agent
            </Link>
          </Button>
        </motion.div>
      </div>


      

      {/* Right Side Image */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="flex-1 flex justify-center items-center "
      >
        <img
          src="/herovoxaa.png"
          alt="Hero Illustration"
          className="w-[90%] md:w-[480px] lg:w-[540px] h-auto object-contain select-none md:ml-20"
          draggable={false}
        />
      </motion.div>


    </div>

    <div className="pr-220">

    

    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-10"
    >
      
      


      
    </motion.div>
    
    </div>
  </section>
  
);

export default HeroSection;
