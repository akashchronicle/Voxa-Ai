import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

interface VoiceAgentConfig {
  speechKey: string;
  speechRegion: string;
  openAiEndpoint: string;
  openAiKey: string;
  openAiDeployment: string;
  agentInstructions: string;
}

interface VoiceAgentState {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  transcript: string;
  lastResponse: string;
  error: string | null;
}

export const useAzureVoiceAgent = (config: VoiceAgentConfig) => {
  const [state, setState] = useState<VoiceAgentState>({
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
    transcript: '',
    lastResponse: '',
    error: null,
  });

  const recognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null);
  const synthesizerRef = useRef<SpeechSDK.SpeechSynthesizer | null>(null);
  const audioConfigRef = useRef<SpeechSDK.AudioConfig | null>(null);
  const conversationHistoryRef = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const isInitializedRef = useRef(false);
  const configRef = useRef(config);
  const currentSpeakingRef = useRef<string | null>(null);
  const shouldCancelSpeechRef = useRef(false);

  // Update config ref when config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Initialize Azure Speech services
  const initializeSpeechServices = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    try {
      // Check if required config values are present
      if (!configRef.current.speechKey || !configRef.current.speechRegion) {
        setState(prev => ({ 
          ...prev, 
          error: 'Azure Speech credentials not configured' 
        }));
        return;
      }

      // Initialize Speech Config
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        configRef.current.speechKey,
        configRef.current.speechRegion
      );

      // Configure for real-time recognition
      speechConfig.speechRecognitionLanguage = 'en-US';
      speechConfig.enableDictation();

      // Initialize Audio Config with specific device to avoid conflicts
      audioConfigRef.current = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

      // Initialize Recognizer
      recognizerRef.current = new SpeechSDK.SpeechRecognizer(
        speechConfig,
        audioConfigRef.current
      );

      // Initialize Synthesizer
      synthesizerRef.current = new SpeechSDK.SpeechSynthesizer(speechConfig);

      // Set up event handlers
      setupRecognizerEvents();
      setupSynthesizerEvents();

      isInitializedRef.current = true;
      setState(prev => ({ ...prev, error: null }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: `Failed to initialize speech services: ${error}` 
      }));
    }
  }, []); // No dependencies - uses ref instead

  // Set up speech synthesis events
  const setupSynthesizerEvents = useCallback(() => {
    if (!synthesizerRef.current) return;

    synthesizerRef.current.synthesisStarted = (_s: any, _e: any) => {
      setState(prev => ({ ...prev, isSpeaking: true }));
    };

    synthesizerRef.current.synthesisCompleted = (_s: any, _e: any) => {
      setState(prev => ({ ...prev, isSpeaking: false }));
      currentSpeakingRef.current = null;
      shouldCancelSpeechRef.current = false;
    };

    synthesizerRef.current.SynthesisCanceled = (_s: any, _e: any) => {
      setState(prev => ({ ...prev, isSpeaking: false }));
      currentSpeakingRef.current = null;
      shouldCancelSpeechRef.current = false;
    };
  }, []);

  // Stop current speech immediately
  const stopCurrentSpeech = useCallback(() => {
    shouldCancelSpeechRef.current = true;
    
    if (synthesizerRef.current) {
      synthesizerRef.current.close();
      // Recreate synthesizer
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        configRef.current.speechKey,
        configRef.current.speechRegion
      );
      synthesizerRef.current = new SpeechSDK.SpeechSynthesizer(speechConfig);
      setupSynthesizerEvents();
    }
    
    setState(prev => ({ ...prev, isSpeaking: false }));
    currentSpeakingRef.current = null;
  }, [setupSynthesizerEvents]);

  // Set up speech recognition events
  const setupRecognizerEvents = useCallback(() => {
    if (!recognizerRef.current) return;

    recognizerRef.current.recognized = (s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        const transcript = e.result.text;
        setState(prev => ({ ...prev, transcript }));
        
        // If AI is speaking, stop it immediately and respond to new input
        if (state.isSpeaking) {
          stopCurrentSpeech();
        }
        
        processUserInput(transcript);
      }
    };

    recognizerRef.current.recognizing = (s, e) => {
      // Real-time partial results
      setState(prev => ({ ...prev, transcript: e.result.text }));
    };

    recognizerRef.current.canceled = (s, e) => {
      setState(prev => ({ 
        ...prev, 
        error: `Recognition canceled: ${e.reason}` 
      }));
    };

    recognizerRef.current.sessionStopped = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };
  }, [state.isSpeaking, stopCurrentSpeech]);

  // Process user input with Azure OpenAI
  const processUserInput = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Add user input to conversation history
      conversationHistoryRef.current.push({ role: 'user', content: userInput });

      // Prepare messages for Azure OpenAI
      const messages = [
        { role: 'system', content: configRef.current.agentInstructions },
        ...conversationHistoryRef.current.slice(-10) // Keep last 10 messages for context
      ];

      // Call Azure OpenAI
      const response = await fetch('/api/azure-voice-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Azure OpenAI error: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;

      // Add assistant response to conversation history
      conversationHistoryRef.current.push({ role: 'assistant', content: assistantResponse });

      setState(prev => ({ 
        ...prev, 
        lastResponse: assistantResponse,
        isProcessing: false 
      }));

      // Synthesize and speak the response
      speakResponse(assistantResponse);

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: `Processing error: ${error}`,
        isProcessing: false 
      }));
    }
  }, []); // No dependencies - uses ref instead

  // Synthesize and speak the response
  const speakResponse = useCallback((text: string) => {
    if (!synthesizerRef.current || shouldCancelSpeechRef.current) return;

    // Store the current speaking text
    currentSpeakingRef.current = text;

    // Add a small delay to ensure synthesizer is ready
    setTimeout(() => {
      if (shouldCancelSpeechRef.current) return;
      
      synthesizerRef.current?.speakTextAsync(
        text,
        (result: any) => {
          if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            // Audio is playing
          } else {
            setState(prev => ({
              ...prev,
              error: `Speech synthesis failed: ${result.reason}`
            }));
          }
        },
        (error: any) => {
          setState(prev => ({
            ...prev,
            error: `Speech synthesis error: ${error}`
          }));
        }
      );
    }, 100);
  }, []);

  // Stop speaking immediately
  const stopSpeaking = useCallback(() => {
    stopCurrentSpeech();
  }, [stopCurrentSpeech]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognizerRef.current) {
      initializeSpeechServices();
      return;
    }

    // Add a small delay to prevent conflicts with Stream Video
    setTimeout(() => {
      setState(prev => ({ ...prev, isListening: true, error: null }));
      recognizerRef.current?.startContinuousRecognitionAsync();
    }, 500);
  }, [initializeSpeechServices]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognizerRef.current) return;

    setState(prev => ({ ...prev, isListening: false }));
    recognizerRef.current.stopContinuousRecognitionAsync();
  }, []);

  // Clear conversation history
  const clearHistory = useCallback(() => {
    conversationHistoryRef.current = [];
    setState(prev => ({ 
      ...prev, 
      transcript: '', 
      lastResponse: '' 
    }));
  }, []);

  // Initialize on mount only once
  useEffect(() => {
    if (!isInitializedRef.current) {
      initializeSpeechServices();
    }

    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.close();
      }
      if (synthesizerRef.current) {
        synthesizerRef.current.close();
      }
      if (audioConfigRef.current) {
        audioConfigRef.current.close();
      }
      isInitializedRef.current = false;
    };
  }, []); // Empty dependency array - only run once

  return {
    // State
    ...state,
    
    // Actions
    startListening,
    stopListening,
    stopSpeaking,
    clearHistory,
    
    // Conversation
    conversationHistory: conversationHistoryRef.current,
  };
}; 