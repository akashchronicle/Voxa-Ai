import { OpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export interface AzureOpenAIChatCompletionRequest {
  messages: ChatCompletionMessageParam[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stop?: string[];
  stream?: boolean;
  // Add more as needed
}

export interface AzureOpenAIChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: string | null;
    message: {
      role: string;
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT!;
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY!;
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT!;
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION!;

if (
  !AZURE_OPENAI_ENDPOINT ||
  !AZURE_OPENAI_KEY ||
  !AZURE_OPENAI_DEPLOYMENT ||
  !AZURE_OPENAI_API_VERSION
) {
  throw new Error("Missing Azure OpenAI environment variables");
}

export function getAzureOpenAIClient() {
  return new OpenAI({
    apiKey: AZURE_OPENAI_KEY,
    baseURL: `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}`,
    defaultQuery: { "api-version": AZURE_OPENAI_API_VERSION },
    defaultHeaders: { "api-key": AZURE_OPENAI_KEY },
  });
}

export async function createAzureOpenAIChatCompletion(
  req: AzureOpenAIChatCompletionRequest
): Promise<AzureOpenAIChatCompletionResponse> {
  const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": AZURE_OPENAI_KEY,
    },
    body: JSON.stringify({
      ...req,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Azure OpenAI API error: ${response.status} ${error}`);
  }

  return response.json();
} 