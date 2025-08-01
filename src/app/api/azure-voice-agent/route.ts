import { NextRequest, NextResponse } from 'next/server';
import { createAzureOpenAIChatCompletion } from '@/lib/azure-openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, max_tokens = 150, temperature = 0.7 } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Call Azure OpenAI
    const response = await createAzureOpenAIChatCompletion({
      messages,
      max_tokens,
      temperature,
      stream: false,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Azure Voice Agent API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice agent request' },
      { status: 500 }
    );
  }
} 