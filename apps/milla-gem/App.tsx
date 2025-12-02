import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, MessageSender, ToolCall, VoiceOption, GroundingSource } from './types';
import { ChatWindow } from './components/ChatWindow';
import { InputBar } from './components/InputBar';
import { SettingsPanel } from './components/SettingsPanel';
import { SuggestedReplies } from './components/SuggestedReplies';
import { useSpeech } from './hooks/useSpeech';
import { useLiveConversation } from './hooks/useLiveConversation';
import * as geminiService from './services/geminiService';
import { executeTool } from './services/apiService';
import { GenerateContentResponse, FunctionCall, Part } from '@google/genai';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'initial',
    sender: MessageSender.AI,
    text: "Hello! I'm Milla, your AI assistant. How can I help you today?",
  },
];

const DEFAULT_PERSONA = "You are Milla, a friendly and helpful AI assistant. You are concise unless asked for details. You can use tools to help users with their tasks. If you need more information to use a tool, you must ask the user for it before calling the tool.";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  // Settings with Persistence
  const [showSettings, setShowSettings] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState(() => localStorage.getItem('milla-persona') || DEFAULT_PERSONA);
  const [useGoogleSearch, setUseGoogleSearch] = useState(() => localStorage.getItem('milla-google-search') === 'true');
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(() => {
      const saved = localStorage.getItem('milla-voice');
      return saved ? JSON.parse(saved) : null;
  });
  const [isGoogleConnected, setIsGoogleConnected] = useState(() => localStorage.getItem('milla-google-connected') === 'true');

  const { voices, speak } = useSpeech();

  // Save settings to localStorage whenever they change
  useEffect(() => { localStorage.setItem('milla-persona', systemInstruction); }, [systemInstruction]);
  useEffect(() => { localStorage.setItem('milla-google-search', String(useGoogleSearch)); }, [useGoogleSearch]);
  useEffect(() => { localStorage.setItem('milla-voice', JSON.stringify(selectedVoice)); }, [selectedVoice]);
  useEffect(() => { localStorage.setItem('milla-google-connected', String(isGoogleConnected)); }, [isGoogleConnected]);

  
  const handleLiveToolCall = useCallback(async (toolCall: FunctionCall, sendToolResults: (id: string, name: string, result: any) => void) => {
      const toolMessage: ChatMessage = {
        id: uuidv4(),
        sender: MessageSender.AI,
        text: '',
        toolCalls: [{ ...toolCall, status: 'pending' }]
      };
      setMessages(prev => [...prev, toolMessage]);

      try {
        let result;
        if (toolCall.name === 'generate_image') {
          result = await geminiService.generateImage(toolCall.args.prompt);
        } else {
          result = await executeTool(toolCall.name, toolCall.args);
        }

        setMessages(prev => prev.map(m => 
          m.id === toolMessage.id 
            ? { ...m, toolCalls: m.toolCalls?.map(tc => tc.id === toolCall.id ? { ...tc, status: 'success', result } : tc) }
            : m
        ));
        
        sendToolResults(toolCall.id, toolCall.name, { result });

      } catch (e: any) {
        const error = e.message || 'An unknown error occurred.';
        setMessages(prev => prev.map(m => 
          m.id === toolMessage.id 
            ? { ...m, toolCalls: m.toolCalls?.map(tc => tc.id === toolCall.id ? { ...tc, status: 'error', error } : tc) }
            : m
        ));
        sendToolResults(toolCall.id, toolCall.name, { error });
      }
  }, []);

  // Live Conversation
  const handleTranscription = useCallback((isFinal: boolean, text: string, sender: 'user' | 'ai') => {
      setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          // Append to the last message if it's part of the same live turn
          if (lastMsg && lastMsg.sender === (sender === 'user' ? MessageSender.USER : MessageSender.AI) && lastMsg.isLive) {
              const newMessages = [...prev];
              // Use function form of text update to get latest value
              const updatedMessage = { ...lastMsg, text: (lastMsg.text || '') + text, isLive: !isFinal };
              newMessages[newMessages.length - 1] = updatedMessage;
              return newMessages;
          } else {
              // Create a new message for this turn, clearing previous empty live messages
              const filteredPrev = prev.filter(m => !(m.isLive && m.text === '' && !m.toolCalls));
              return [...filteredPrev, { id: uuidv4(), sender: sender === 'user' ? MessageSender.USER : MessageSender.AI, text, isLive: !isFinal }];
          }
      });
  }, []);

  const handleConversationEnd = useCallback(() => {
    // Clean up any lingering live messages
    setMessages(prev => prev.map(m => ({ ...m, isLive: false })).filter(m => m.text.trim() !== '' || m.toolCalls || m.image));
  }, []);

  const { isConnecting, isConnected, startConversation, stopConversation } = useLiveConversation(handleTranscription, handleConversationEnd, handleLiveToolCall);

  useEffect(() => {
    geminiService.startChat(systemInstruction, useGoogleSearch);
  }, [systemInstruction, useGoogleSearch]);

  const handleSystemInstructionChange = (instruction: string) => {
    setSystemInstruction(instruction);
    setMessages(INITIAL_MESSAGES);
  };
  
  const handleGoogleSearchChange = (use: boolean) => {
      setUseGoogleSearch(use);
      setMessages(INITIAL_MESSAGES);
  };

  const fetchAndSetSuggestedAction = async () => {
     // Create a simplified history for the suggestion prompt
      const history = messages.slice(-6).map((msg): { role: string, parts: Part[] } => ({
        role: msg.sender === MessageSender.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      
      const action = await geminiService.getSuggestedAction(history);
      if (action) {
          setMessages(prev => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && lastMsg.sender === MessageSender.AI && !lastMsg.suggestedAction) {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = { ...lastMsg, suggestedAction: action };
                  return newMessages;
              }
              return prev;
          });
      }
  };

  const processApiResponse = (response: GenerateContentResponse) => {
    const text = response.text;
    const functionCalls = response.functionCalls;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    const sources: GroundingSource[] = groundingMetadata?.groundingChunks
        ?.map(chunk => chunk.web || chunk.maps)
        .filter(source => source?.uri && source.title)
        .map(source => ({ uri: source!.uri, title: source!.title })) || [];

    const newAiMessage: ChatMessage = {
      id: uuidv4(),
      sender: MessageSender.AI,
      text: text || '',
      sources: sources.length > 0 ? sources : undefined,
      toolCalls: functionCalls?.map((fc: FunctionCall): ToolCall => ({
          ...fc,
          status: geminiService.getConfirmableActions().includes(fc.name) ? 'pending_confirmation' : 'pending',
          // Pre-calculate draft result for confirmable actions
          result: geminiService.getConfirmableActions().includes(fc.name) ? executeTool(fc.name, fc.args, true) : undefined
      }))
    };
    
    setMessages(prev => [...prev, newAiMessage]);

    if (selectedVoice && text) {
      speak(text, selectedVoice.uri);
    }
    
    // If the response is just text and not a tool call, check for a suggested action
    if (text && !functionCalls) {
        fetchAndSetSuggestedAction();
    }
  };
  
  const getFinalConfirmation = async (toolCall: ToolCall, toolResult: any) => {
      try {
        const apiResponse = await geminiService.sendFunctionResponse(toolCall.id, toolCall.name, { result: toolResult });
        processApiResponse(apiResponse);
      } catch (e) {
          console.error("Error getting final confirmation", e);
      }
  }
  
  const executeAction = async (toolCall: ToolCall, messageId?: string) => {
      const toolMessageId = messageId || uuidv4();
      
      if (messageId) {
          setMessages(prev => prev.map(m => 
              m.id === messageId
                  ? { ...m, toolCalls: m.toolCalls?.map(tc => tc.id === toolCall.id ? { ...tc, status: 'pending' } : tc), suggestedAction: undefined }
                  : m
          ));
      } else {
        const toolMessage: ChatMessage = {
            id: toolMessageId,
            sender: MessageSender.AI,
            text: '',
            toolCalls: [{ ...toolCall, status: 'pending' }]
        };
        setMessages(prev => [...prev, toolMessage]);
      }


      try {
        let result;
        if (toolCall.name === 'generate_image') {
            result = await geminiService.generateImage(toolCall.args.prompt);
        } else {
            result = await executeTool(toolCall.name, toolCall.args);
        }

         setMessages(prev => prev.map(m => {
            if (m.toolCalls?.some(tc => tc.id === toolCall.id)) {
                return {
                    ...m,
                    toolCalls: m.toolCalls.map(tc => tc.id === toolCall.id ? { ...tc, status: 'success', result } : tc)
                };
            }
            return m;
         }));

        getFinalConfirmation(toolCall, result);

      } catch(e: any) {
        const error = e.message || 'An unknown error occurred.';
        setMessages(prev => prev.map(m => {
            if (m.toolCalls?.some(tc => tc.id === toolCall.id)) {
                return {
                    ...m,
                    toolCalls: m.toolCalls.map(tc => tc.id === toolCall.id ? { ...tc, status: 'error', error } : tc)
                };
            }
            return m;
         }));
      }
  };

  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: MessageSender.USER,
      text: text,
      image: attachedImage,
    };
    setMessages(prev => [...prev, userMessage, { id: uuidv4(), sender: MessageSender.AI, text: '' }]);
    const currentImage = attachedImage;
    setAttachedImage(null);

    try {
      const response = await geminiService.sendMessage(text, currentImage);
      
      setMessages(prev => prev.slice(0, -1));
      
      if (response.functionCalls?.some(fc => !geminiService.getConfirmableActions().includes(fc.name))) {
          // If there is any non-confirmable action, execute it right away
          const newAiMessage: ChatMessage = {
            id: uuidv4(),
            sender: MessageSender.AI,
            text: response.text || '',
            toolCalls: response.functionCalls.map(fc => ({...fc, status: 'pending'}))
          };
          setMessages(prev => [...prev, newAiMessage]);
          for (const fc of response.functionCalls) {
              await executeAction(fc, newAiMessage.id);
          }
      } else {
          processApiResponse(response);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        sender: MessageSender.AI,
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfirmTool = (toolCall: ToolCall, messageId: string) => {
      executeAction(toolCall, messageId);
  };
  
  const handleCancelTool = (toolCallId: string, messageId: string) => {
      setMessages(prev => prev.map(m =>
          m.id === messageId
              ? { ...m, toolCalls: m.toolCalls?.filter(tc => tc.id !== toolCallId) }
              : m
      ).filter(m => m.text || (m.toolCalls && m.toolCalls.length > 0))); // Also remove message if it becomes empty
  };

  const handleExecuteToolFromCard = (toolName: string, args: any) => {
    const newToolCall: ToolCall = {
      id: `card-action-${uuidv4()}`,
      name: toolName,
      args: args,
    };
    // This will create a new message with the tool call
    executeAction(newToolCall);
  };


  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans">
      <header className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10 shrink-0">
        <h1 className="text-xl font-bold">Milla AI</h1>
        <div className="relative">
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
             <span className="material-symbols-outlined">settings</span>
          </button>
          {showSettings && (
            <SettingsPanel 
                voices={voices}
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
                useGoogleSearch={useGoogleSearch}
                onGoogleSearchChange={handleGoogleSearchChange}
                onClearChat={() => setMessages(INITIAL_MESSAGES)}
                systemInstruction={systemInstruction}
                onSystemInstructionChange={handleSystemInstructionChange}
                isGoogleConnected={isGoogleConnected}
                onGoogleConnectChange={setIsGoogleConnected}
            />
          )}
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-y-auto">
        <ChatWindow 
            messages={messages} 
            isLoading={isLoading} 
            onExecuteAction={(action) => executeAction(action)}
            onConfirmTool={handleConfirmTool}
            onCancelTool={handleCancelTool}
            onExecuteToolFromCard={handleExecuteToolFromCard}
        />
      </main>
      <footer className="p-4 shrink-0">
         <SuggestedReplies replies={["What's the weather?", "Book me a flight", "What can you do?"]} onSend={handleSendMessage} />
        <InputBar 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            attachedImage={attachedImage}
            setAttachedImage={setAttachedImage}
            isConnecting={isConnecting}
            isConnected={isConnected}
            startConversation={startConversation}
            stopConversation={stopConversation}
        />
      </footer>
    </div>
  );
}

export default App;