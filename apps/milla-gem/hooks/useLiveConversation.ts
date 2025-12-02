import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob, FunctionCall } from '@google/genai';
import { getToolDeclarations } from '../services/geminiService';

// Audio encoding/decoding helper functions
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

export const useLiveConversation = (
    onTranscriptionUpdate: (isFinal: boolean, text: string, sender: 'user' | 'ai') => void,
    onConversationEnd: () => void,
    onToolCall: (toolCall: FunctionCall, sendToolResults: (id: string, name: string, result: any) => void) => void,
) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);

    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const audioQueueRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef(0);
    
    const sendToolResults = useCallback((id: string, name: string, result: any) => {
        sessionPromiseRef.current?.then(session => {
            session.sendToolResponse({
                functionResponses: {
                    id,
                    name,
                    response: result
                }
            });
        });
    }, []);

    const cleanup = useCallback(() => {
        if (mediaStreamSourceRef.current && scriptProcessorRef.current) {
            mediaStreamSourceRef.current.disconnect();
            scriptProcessorRef.current.disconnect();
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.onaudioprocess = null;
        }
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        
        audioQueueRef.current.forEach(source => source.stop());
        audioQueueRef.current.clear();
        nextStartTimeRef.current = 0;

        inputAudioContextRef.current?.close().catch(console.error);
        outputAudioContextRef.current?.close().catch(console.error);
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;

        setIsConnected(false);
        setIsConnecting(false);
        sessionPromiseRef.current = null;
    }, []);

    const stopConversation = useCallback(async () => {
        if (sessionPromiseRef.current) {
            try {
                const session = await sessionPromiseRef.current;
                session.close();
            } catch (e) {
                console.error('Error closing live session:', e);
            }
        }
        cleanup();
        onConversationEnd();
    }, [cleanup, onConversationEnd]);

    const startConversation = useCallback(async () => {
        if (isConnecting || isConnected) return;
        setIsConnecting(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-pro', // Using pro for tool use
                callbacks: {
                    onopen: () => {
                        setIsConnecting(false);
                        setIsConnected(true);

                        const inputCtx = inputAudioContextRef.current!;
                        const source = inputCtx.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;
                        const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (event) => {
                            const inputData = event.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputCtx.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.toolCall) {
                             for (const fc of message.toolCall.functionCalls) {
                                onToolCall(fc, sendToolResults);
                            }
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const outputCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            
                            const currentSource = source;
                            audioQueueRef.current.add(currentSource);
                            source.onended = () => audioQueueRef.current.delete(currentSource);
                            
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                        }
                        if (message.serverContent?.inputTranscription) {
                            onTranscriptionUpdate(false, message.serverContent.inputTranscription.text, 'user');
                        }
                        if (message.serverContent?.outputTranscription) {
                            onTranscriptionUpdate(false, message.serverContent.outputTranscription.text, 'ai');
                        }
                        if (message.serverContent?.turnComplete) {
                            onTranscriptionUpdate(true, '', 'user');
                            onTranscriptionUpdate(true, '', 'ai');
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        stopConversation();
                    },
                    onclose: () => {
                        stopConversation();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    tools: [{ functionDeclarations: getToolDeclarations() }],
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (error) {
            console.error('Failed to start live conversation:', error);
            setIsConnecting(false);
            cleanup();
        }
    }, [isConnecting, isConnected, cleanup, onTranscriptionUpdate, onConversationEnd, onToolCall, sendToolResults, stopConversation]);

    useEffect(() => {
        return () => {
            stopConversation();
        };
    }, [stopConversation]);

    return { isConnecting, isConnected, startConversation, stopConversation };
};