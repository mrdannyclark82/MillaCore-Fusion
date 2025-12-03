import {
  GoogleGenAI,
  GenerateContentResponse,
  Chat,
  Part,
  FunctionDeclaration,
  Type,
  FunctionCall,
} from '@google/genai';

const toolDeclarations: FunctionDeclaration[] = [
  {
    name: 'get_stock_price',
    description: 'Get the latest stock price for a given ticker symbol.',
    parameters: {
      type: Type.OBJECT,
      properties: { ticker_symbol: { type: Type.STRING, description: 'The stock ticker symbol, e.g., GOOGL.' } },
      required: ['ticker_symbol']
    }
  },
  {
    name: 'schedule_meeting',
    description: 'Schedule a meeting in the calendar.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'The title of the meeting.' },
        time: { type: Type.STRING, description: 'The time of the meeting, e.g., "3 PM" or "15:00".' },
        participants: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Emails of participants.' }
      },
      required: ['title', 'time']
    }
  },
  {
    name: 'send_email',
    description: 'Send an email.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        recipient: { type: Type.STRING, description: 'The recipient\'s email address.' },
        subject: { type: Type.STRING, description: 'The subject of the email.' },
        body: { type: Type.STRING, description: 'The body of the email.' }
      },
      required: ['recipient', 'subject', 'body']
    }
  },
  {
    name: 'add_to_do_item',
    description: 'Add an item to the to-do list.',
    parameters: {
      type: Type.OBJECT,
      properties: { item: { type: Type.STRING, description: 'The to-do item text.' } },
      required: ['item']
    }
  },
  {
    name: 'get_to_do_list',
    description: 'Get all items from the to-do list.',
    parameters: { type: Type.OBJECT, properties: {} }
  },
  {
    name: 'remove_from_to_do_list',
    description: 'Remove an item from the to-do list.',
    parameters: {
        type: Type.OBJECT,
        properties: { item: { type: Type.STRING, description: 'The to-do item to remove.' } },
        required: ['item']
    }
  },
  {
    name: 'get_news_headlines',
    description: 'Get top news headlines for a given topic.',
    parameters: {
        type: Type.OBJECT,
        properties: { topic: { type: Type.STRING, description: 'The topic for news, e.g., "technology".' } }
    }
  },
  {
    name: 'track_package',
    description: 'Track a package using its tracking number.',
    parameters: {
        type: Type.OBJECT,
        properties: { tracking_number: { type: Type.STRING, description: 'The package tracking number.' } },
        required: ['tracking_number']
    }
  },
  {
      name: 'execute_python_code',
      description: 'Execute a snippet of Python code.',
      parameters: {
          type: Type.OBJECT,
          properties: { code: { type: Type.STRING, description: 'The Python code to execute.' } },
          required: ['code']
      }
  },
  {
      name: 'debug_python_code',
      description: 'Debug a snippet of Python code step-by-step to understand its execution flow and variable states.',
      parameters: {
          type: Type.OBJECT,
          properties: { code: { type: Type.STRING, description: 'The Python code to debug.' } },
          required: ['code']
      }
  },
  {
      name: 'set_reminder',
      description: 'Set a reminder.',
      parameters: {
          type: Type.OBJECT,
          properties: {
              reminder_text: { type: Type.STRING, description: 'The text of the reminder.' },
              time: { type: Type.STRING, description: 'The time for the reminder.' }
          },
          required: ['reminder_text', 'time']
      }
  },
  {
      name: 'get_calendar_events',
      description: 'Get events from the calendar for a given date range.',
      parameters: {
          type: Type.OBJECT,
          properties: { date_range: { type: Type.STRING, description: 'The date range, e.g., "today", "tomorrow".' } },
          required: ['date_range']
      }
  },
  {
      name: 'play_music',
      description: 'Play music on a streaming service.',
      parameters: {
          type: Type.OBJECT,
          properties: {
              track: { type: Type.STRING, description: 'The name of the track.' },
              artist: { type: Type.STRING, description: 'The name of the artist.' }
          }
      }
  },
  {
      name: 'play_youtube_video',
      description: 'Find and play a YouTube video.',
      parameters: {
          type: Type.OBJECT,
          properties: { query: { type: Type.STRING, description: 'The search query for the video.' } },
          required: ['query']
      }
  },
  {
    name: 'generate_image',
    description: 'Generate an image based on a descriptive prompt.',
    parameters: {
        type: Type.OBJECT,
        properties: { prompt: { type: Type.STRING, description: 'The detailed description for the image.' } },
        required: ['prompt']
    }
  },
   {
      name: 'respond_to_google_voice',
      description: 'Respond to a message on Google Voice.',
      parameters: {
          type: Type.OBJECT,
          properties: {
              recipient: { type: Type.STRING, description: 'The recipient\'s phone number or name.' },
              message: { type: Type.STRING, description: 'The message to send.' }
          },
          required: ['recipient', 'message']
      }
  },
   {
      name: 'respond_to_facebook_messenger',
      description: 'Respond to a message on Facebook Messenger.',
      parameters: {
          type: Type.OBJECT,
          properties: {
              recipient: { type: Type.STRING, description: 'The recipient\'s name.' },
              message: { type: Type.STRING, description: 'The message to send.' }
          },
          required: ['recipient', 'message']
      }
  },
  {
    name: 'book_flight',
    description: 'Book a flight for a user.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            destination: { type: Type.STRING, description: 'The destination city.' },
            departure_date: { type: Type.STRING, description: 'The departure date, e.g., "next Friday" or "2024-08-15".' },
            return_date: { type: Type.STRING, description: 'The return date (optional for one-way flights).' }
        },
        required: ['destination', 'departure_date']
    }
  },
];

export const getToolDeclarations = () => toolDeclarations;

export const confirmableActions = [
    'schedule_meeting',
    'send_email',
    'set_reminder',
    'add_to_do_item',
    'remove_from_to_do_list',
    'play_music',
    'execute_python_code',
    'respond_to_google_voice',
    'respond_to_facebook_messenger',
    'book_flight',
];

export const getConfirmableActions = () => confirmableActions;

let ai: GoogleGenAI;
let chat: Chat | null = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }
  return ai;
};

export const startChat = (systemInstruction: string, useGoogleSearch: boolean) => {
  const ai = getAI();
  const tools: any = [{ functionDeclarations: toolDeclarations }];

  if (useGoogleSearch) {
      tools.push({ googleSearch: {} });
  }

  chat = ai.chats.create({
    model: 'gemini-2.5-pro',
    config: {
        systemInstruction,
        tools: tools,
    }
  });
};

const dataUrlToGenerativePart = async (dataUrl: string): Promise<Part> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(blob);
    });
    return {
        inlineData: {
            data: base64,
            mimeType: blob.type,
        },
    };
};

export const sendMessage = async (message: string, image: string | null): Promise<GenerateContentResponse> => {
  if (!chat) {
    throw new Error('Chat not initialized. Call startChat first.');
  }

  const contents: Part[] = [{ text: message }];
  if (image) {
      contents.unshift(await dataUrlToGenerativePart(image));
  }
  
  const response = await chat.sendMessage({ contents });
  return response;
};


export const sendFunctionResponse = async (id: string, name: string, functionResult: any): Promise<GenerateContentResponse> => {
    if (!chat) {
        throw new Error('Chat not initialized.');
    }

    const response = await chat.sendMessage({
        contents: {
            role: 'function',
            parts: [{
                functionResponse: {
                    name,
                    response: functionResult,
                    id,
                }
            }]
        }
    });

    return response;
};

export const generateImage = async (prompt: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return base64ImageBytes;
}

// FIX: New function to get a suggested action from the model.
export const getSuggestedAction = async (history: { role: string; parts: Part[] }[]): Promise<FunctionCall | null> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [
                ...history,
                { role: 'user', parts: [{ text: 'Based on our conversation, is there a single, relevant tool action I might want to take next? Only respond if it is highly relevant.' }] }
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        "suggested_action": {
                            type: Type.OBJECT,
                            properties: {
                                "name": { type: Type.STRING },
                                "args": { type: Type.STRING, description: "A valid JSON string representing the arguments." },
                            },
                        },
                    },
                },
                tools: [{ functionDeclarations: toolDeclarations }]
            }
        });

        const jsonText = response.text.trim();
        if (!jsonText) return null;

        const parsed = JSON.parse(jsonText);
        const action = parsed.suggested_action;
        if (action && action.name && action.args) {
            return {
                id: `suggested-${Date.now()}`,
                name: action.name,
                args: JSON.parse(action.args),
            };
        }
        return null;
    } catch (e) {
        console.error("Error fetching suggested action:", e);
        return null;
    }
}