"use client";

import { useState } from 'react';
import { cleanMarkdown, testMarkdownCleaning } from '@/lib/markdown-cleaner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, Mic, Code, CheckCircle } from 'lucide-react';

export default function MarkdownCleanerDemoPage() {
  const [inputText, setInputText] = useState(`# Welcome to Markdown Cleaner Demo

This is a **bold text** and *italic text* example.

## Features
- Removes **markdown formatting**
- Converts [links](https://example.com) to plain text
- Cleans up \`code blocks\` and \`\`\`multiline code\`\`\`
- Removes list markers like:
  - Bullet points
  - Numbered items
1. First item
2. Second item

> This is a blockquote that will be cleaned.

---

**Bold text** with ~~strikethrough~~ and \`inline code\`.

![Image alt text](image.jpg) will be removed completely.`);

  const cleanedText = cleanMarkdown(inputText);

  const handleRunTests = () => {
    testMarkdownCleaning();
  };

  const handleReset = () => {
    setInputText(`# Welcome to Markdown Cleaner Demo

This is a **bold text** and *italic text* example.

## Features
- Removes **markdown formatting**
- Converts [links](https://example.com) to plain text
- Cleans up \`code blocks\` and \`\`\`multiline code\`\`\`
- Removes list markers like:
  - Bullet points
  - Numbered items
1. First item
2. Second item

> This is a blockquote that will be cleaned.

---

**Bold text** with ~~strikethrough~~ and \`inline code\`.

![Image alt text](image.jpg) will be removed completely.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Markdown Cleaner Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test the markdown cleaning functionality that removes formatting for natural TTS speech.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="default" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              TTS Optimized
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Markdown Support
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Natural Speech
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button onClick={handleRunTests} variant="outline">
            Run Tests in Console
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset Example
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Original Markdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter markdown text here..."
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                Characters: {inputText.length}
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Cleaned Text (TTS Ready)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px] p-3 bg-gray-50 rounded-md border font-mono text-sm whitespace-pre-wrap">
                {cleanedText}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Characters: {cleanedText.length} (Reduced by {inputText.length - cleanedText.length})
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Headers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Removes # ## ### headers while preserving the text content.
              </p>
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                <div># Header → Header</div>
                <div>## Subheader → Subheader</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Formatting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Removes bold, italic, code, and strikethrough formatting.
              </p>
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                <div>**bold** → bold</div>
                <div>*italic* → italic</div>
                <div>`code` → code</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Links & Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Converts links to text and removes list markers.
              </p>
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                <div>[text](url) → text</div>
                <div>- item → item</div>
                <div>1. item → item</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Instructions */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">1. AI Response Processing</h4>
              <p className="text-sm text-gray-600">
                When the AI generates a response with markdown formatting, it's automatically cleaned before being sent to the TTS engine.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">2. Natural Speech Output</h4>
              <p className="text-sm text-gray-600">
                The cleaned text is then converted to speech without reading out markdown symbols, making it sound natural and conversational.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">3. Automatic Integration</h4>
              <p className="text-sm text-gray-600">
                This cleaning happens automatically in the voice agent system - no manual intervention required.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 