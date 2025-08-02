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
  const speechConfigRef = useRef<SpeechSDK.SpeechConfig | null>(null);
  const currentAudioContextRef = useRef<AudioContext | null>(null);
  const currentUtteranceRef = useRef<any>(null);
  const pendingSpeechCountRef = useRef(0);

  // Helper function to create browser speech utterance with event handlers
  const createBrowserSpeechUtterance = useCallback((text: string, context: string = 'default') => {
    const utterance = new (window as any).SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Store the current utterance
    currentUtteranceRef.current = utterance;
    
    // Set up event handlers for browser speech synthesis
    utterance.onstart = () => {
      setState(prev => ({ 
        ...prev, 
        isSpeaking: true,
        error: null // Clear any previous errors
      }));
    };
    
    utterance.onend = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
      currentSpeakingRef.current = null;
      currentUtteranceRef.current = null;
      shouldCancelSpeechRef.current = false;
    };
    
    utterance.onerror = (event: any) => {
      setState(prev => ({ ...prev, isSpeaking: false }));
      currentSpeakingRef.current = null;
      currentUtteranceRef.current = null;
      shouldCancelSpeechRef.current = false;
    };
    
    // Add pause and resume handlers for better state management
    // utterance.onpause = () => {
    //   console.log(`⏸️ Browser speech synthesis paused (${context})`);
    // };
    
    // utterance.onresume = () => {
    //   console.log(`▶️ Browser speech synthesis resumed (${context})`);
    // };
    
    return utterance;
  }, []);

  // Update config ref when config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Initialize Azure Speech services
  const initializeSpeechServices = useCallback(async () => {
    if (isInitializedRef.current) {
      return;
    }
    
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

      // Store speech config reference
      speechConfigRef.current = speechConfig;

      // Initialize Audio Config with specific device to avoid conflicts
      audioConfigRef.current = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

      // Initialize Recognizer
      recognizerRef.current = new SpeechSDK.SpeechRecognizer(
        speechConfig,
        audioConfigRef.current
      );

      // Initialize Synthesizer with NO audio output (we'll handle playback ourselves)
      synthesizerRef.current = new SpeechSDK.SpeechSynthesizer(speechConfig, null); // null for no audio output

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

  // Set up speech synthesis events (minimal setup for custom audio playback)
  const setupSynthesizerEvents = useCallback(() => {
    if (!synthesizerRef.current) {
      return;
    }

    // We only need synthesisStarted to set the initial speaking state
    // The actual playback control is handled by the custom audio element
    synthesizerRef.current.synthesisStarted = (_s: any, _e: any) => {
      setState(prev => ({ 
        ...prev, 
        isSpeaking: true,
        error: null // Clear any previous errors
      }));
    };

    // synthesisCompleted and SynthesisCanceled are handled in the speakResponse callback
    // since we're using custom audio elements for playback control
  }, []);

  // Stop current speech immediately with proper cleanup
  const stopCurrentSpeech = useCallback(() => {
    shouldCancelSpeechRef.current = true;
    
    // Stop custom audio element if it's playing
    if (currentUtteranceRef.current) {
      const audio = currentUtteranceRef.current as HTMLAudioElement;
      audio.pause();
      audio.currentTime = 0;
      currentUtteranceRef.current = null;
    }
    
    // Stop any ongoing speech synthesis
    if (synthesizerRef.current) {
      try {
        synthesizerRef.current.close();
      } catch (error) {
        // Silent error handling
      }
    }

    // Close and recreate synthesizer to ensure clean state
    if (synthesizerRef.current) {
      try {
        synthesizerRef.current.close();
      } catch (error) {
        // Silent error handling
      }
    }

    // Recreate synthesizer with fresh state (no audio output)
    if (speechConfigRef.current) {
      try {
        synthesizerRef.current = new SpeechSDK.SpeechSynthesizer(speechConfigRef.current, null); // null for no audio output
        setupSynthesizerEvents();
      } catch (error) {
        // Silent error handling
      }
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
          // Add a small delay to ensure speech is stopped before processing new input
          setTimeout(() => {
            processUserInput(transcript);
          }, 200);
        } else {
          processUserInput(transcript);
        }
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
    
    if (!userInput.trim() || shouldCancelSpeechRef.current) {
      return;
    }

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

      // Only speak if we haven't been asked to cancel
      if (!shouldCancelSpeechRef.current) {
        
        speakResponse(assistantResponse);
      } else {
        console.log('❌ Skipping speech - should cancel is true');
      }

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
    if (!synthesizerRef.current || shouldCancelSpeechRef.current) {
      // Fallback to browser speech synthesis
      if ((window as any).speechSynthesis) {
        const utterance = createBrowserSpeechUtterance(text, 'primary-fallback');
        (window as any).speechSynthesis.speak(utterance);
        return;
      } else {
        return;
      }
    }

    // Store the current speaking text
    currentSpeakingRef.current = text;

    // Add a small delay to ensure synthesizer is ready
    setTimeout(() => {
      if (shouldCancelSpeechRef.current || !synthesizerRef.current) {
        // Fallback to browser speech synthesis
        if ((window as any).speechSynthesis) {
          const utterance = createBrowserSpeechUtterance(text, 'delay-fallback');
          (window as any).speechSynthesis.speak(utterance);
        }
        return;
      }
      
      synthesizerRef.current?.speakTextAsync(
        text,
        (result: any) => {
          if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            // Create custom audio element for playback control
            if (result.audioData) {
              const blob = new Blob([result.audioData], { type: 'audio/wav' });
              const url = URL.createObjectURL(blob);
              
              const audio = new Audio(url);
              currentUtteranceRef.current = audio;
              
              // Listen to when the audio finishes playing
              audio.addEventListener('ended', () => {
                setState(prev => ({ ...prev, isSpeaking: false }));
                currentSpeakingRef.current = null;
                currentUtteranceRef.current = null;
                shouldCancelSpeechRef.current = false;
                URL.revokeObjectURL(url); // Clean up the blob URL
              });
              
              audio.addEventListener('error', (event) => {
                setState(prev => ({ ...prev, isSpeaking: false }));
                currentSpeakingRef.current = null;
                currentUtteranceRef.current = null;
                shouldCancelSpeechRef.current = false;
                URL.revokeObjectURL(url);
              });
              
              // Start playing the audio
              audio.play().catch((err) => {
                setState(prev => ({ ...prev, isSpeaking: false }));
                currentSpeakingRef.current = null;
                currentUtteranceRef.current = null;
                shouldCancelSpeechRef.current = false;
                URL.revokeObjectURL(url);
              });
            } else {
              setState(prev => ({ ...prev, isSpeaking: false }));
            }
          } else {
            // Fallback to browser speech synthesis
            if ((window as any).speechSynthesis) {
              const utterance = createBrowserSpeechUtterance(text, 'azure-fallback');
              (window as any).speechSynthesis.speak(utterance);
            }
            setState(prev => ({
              ...prev,
              error: `Azure speech synthesis failed: ${result.reason}`
            }));
          }
        },
        (error: any) => {
          // Fallback to browser speech synthesis
          if ((window as any).speechSynthesis) {
            const utterance = createBrowserSpeechUtterance(text, 'azure-error-fallback');
            (window as any).speechSynthesis.speak(utterance);
          }
          setState(prev => ({
            ...prev,
            error: `Azure speech synthesis error: ${error}`
          }));
        }
      );
    }, 100);
  }, []);

  // Stop speaking immediately
  const stopSpeaking = useCallback(() => {
    stopCurrentSpeech();
    
    // Reset pending speech counter
    pendingSpeechCountRef.current = 0;
    
    // Stop custom audio element if it's playing
    if (currentUtteranceRef.current) {
      const audio = currentUtteranceRef.current as HTMLAudioElement;
      audio.pause();
      audio.currentTime = 0;
      setState(prev => ({ ...prev, isSpeaking: false }));
      currentSpeakingRef.current = null;
      currentUtteranceRef.current = null;
      shouldCancelSpeechRef.current = false;
    }
    
    // Also stop browser speech synthesis if it's running
    if ((window as any).speechSynthesis) {
      (window as any).speechSynthesis.cancel();
      // Reset speaking state immediately
      setState(prev => ({ ...prev, isSpeaking: false }));
      currentSpeakingRef.current = null;
      shouldCancelSpeechRef.current = false;
    }
  }, [stopCurrentSpeech]);

  // Check if speech synthesis is actually speaking
  const checkSpeakingStatus = useCallback(() => {
    // Only check browser speech synthesis status, not Azure Speech
    if ((window as any).speechSynthesis && !synthesizerRef.current) {
      const isActuallySpeaking = (window as any).speechSynthesis.speaking;
      
      // If state says we're speaking but we're not actually speaking, fix the state
      if (state.isSpeaking && !isActuallySpeaking) {
        setState(prev => ({ ...prev, isSpeaking: false }));
        currentSpeakingRef.current = null;
        shouldCancelSpeechRef.current = false;
      }
      // If state says we're not speaking but we are actually speaking, fix the state
      else if (!state.isSpeaking && isActuallySpeaking) {
        setState(prev => ({ ...prev, isSpeaking: true }));
      }
    }
  }, [state.isSpeaking]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognizerRef.current) {
      initializeSpeechServices();
      return;
    }

    // Reset cancel flag when starting new session
    shouldCancelSpeechRef.current = false;

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
      // Cleanup function
      shouldCancelSpeechRef.current = true;
      
      if (recognizerRef.current) {
        try {
          recognizerRef.current.close();
        } catch (error) {
          // Silent error handling
        }
      }
      if (synthesizerRef.current) {
        try {
          synthesizerRef.current.close();
        } catch (error) {
          // Silent error handling
        }
      }
      if (audioConfigRef.current) {
        try {
          audioConfigRef.current.close();
        } catch (error) {
          // Silent error handling
        }
      }
      isInitializedRef.current = false;
    };
  }, []); // Empty dependency array - only run once

  // Periodic check to ensure speaking state is accurate (only for browser speech synthesis)
  useEffect(() => {
    // Only run periodic checks if we're using browser speech synthesis (no Azure synthesizer)
    if (synthesizerRef.current) {
      return;
    }

    const interval = setInterval(() => {
      if (state.isSpeaking) {
        checkSpeakingStatus();
      }
    }, 1000); // Check every 1 second when speaking

    return () => clearInterval(interval);
  }, [state.isSpeaking, checkSpeakingStatus]);

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