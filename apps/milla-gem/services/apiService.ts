// This is a simulated API service to execute tool calls.
// In a real application, this would make network requests to actual services.

import {
  ColabResult,
  DebugResult,
  FlightDetails,
  GoogleCalendarEvent,
  NewsHeadlines,
  PackageStatus,
  Reminder,
  SentEmail,
  SentMessage,
  ToDoList,
} from '../types';

const mockToDoList: ToDoList = {
  items: ['Buy groceries', 'Walk the dog'],
};

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// isDraft allows us to get a "preview" of the result for confirmation, without actually changing state.
export const executeTool = async (name: string, args: any, isDraft: boolean = false): Promise<any> => {
  console.log('Executing tool:', name, 'with args:', args);
  if (!isDraft) {
    await delay(1000 + Math.random() * 1000);
  }

  switch (name) {
    case 'get_stock_price':
      if (typeof args.ticker_symbol !== 'string' || !args.ticker_symbol.trim()) {
        throw new Error('Ticker symbol must be provided.');
      }
      const ticker = args.ticker_symbol.toUpperCase();
      const isUp = Math.random() > 0.4;
      const change = (Math.random() * 5).toFixed(2);
      const history = Array.from({ length: 30 }, () => 100 + Math.random() * 20 - 10);
      return {
        ticker: ticker,
        price: `$${(150 + Math.random() * 50).toFixed(2)}`,
        change: `${isUp ? '+' : '-'}$${change}`,
        logo: `https://logo.clearbit.com/${ticker.toLowerCase()}.com`,
        history,
      };

    case 'schedule_meeting':
      if (!args.title || !args.time) {
        throw new Error('Title and time are required to schedule a meeting.');
      }
      const now = new Date();
      // Simple time parser, e.g., "3 PM" or "15:00"
      const timeMatch = args.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
      let hours = timeMatch ? parseInt(timeMatch[1], 10) : 12;
      const minutes = timeMatch && timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const ampm = timeMatch && timeMatch[3] ? timeMatch[3].toUpperCase() : '';
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      now.setHours(hours, minutes, 0, 0);
      const end = new Date(now.getTime() + 60 * 60 * 1000);

      const event: GoogleCalendarEvent = {
        id: `evt-${Date.now()}`,
        summary: args.title,
        htmlLink: 'https://calendar.google.com',
        start: { dateTime: now.toISOString(), timeZone: 'America/Los_Angeles' },
        end: { dateTime: end.toISOString(), timeZone: 'America/Los_Angeles' },
        attendees: args.participants ? args.participants.map((email: string) => ({ email })) : [],
      };
      return event;

    case 'send_email':
      if (!args.recipient || !args.subject || !args.body) {
        throw new Error('Recipient, subject, and body are required to send an email.');
      }
      const email: SentEmail = {
        recipient: args.recipient,
        subject: args.subject,
        body: args.body,
      };
      return email;

    case 'add_to_do_item':
      if (!args.item) {
        throw new Error('An item must be provided to add to the to-do list.');
      }
      if (!isDraft) {
          mockToDoList.items.push(args.item);
      }
      // Return a preview of the new list if it's a draft
      return { items: [...mockToDoList.items, ...(isDraft ? [args.item] : [])] };

    case 'get_to_do_list':
        return { ...mockToDoList };

    case 'remove_from_to_do_list':
        if (!args.item) {
            throw new Error('An item must be provided to remove from the to-do list.');
        }
        if (!isDraft) {
            const index = mockToDoList.items.findIndex(i => i.toLowerCase() === args.item.toLowerCase());
            if (index > -1) {
                mockToDoList.items.splice(index, 1);
            }
        }
        return { ...mockToDoList };

    case 'get_news_headlines':
       return {
         articles: [
           { title: 'Tech Giant Releases New AI Model', source: 'TechCrunch', summary: 'A new model promises to revolutionize...' },
           { title: 'Global Markets React to Economic Data', source: 'Reuters', summary: 'Stocks are volatile after the latest report...' },
           { title: 'Breakthrough in Sustainable Energy', source: 'Science Daily', summary: 'Researchers have developed a new method...' },
         ]
       } as NewsHeadlines;

    case 'track_package':
      if (!args.tracking_number) {
        throw new Error('Tracking number is required.');
      }
      return {
        trackingNumber: args.tracking_number,
        carrier: 'FedEx',
        status: 'Out for Delivery',
        description: 'Your package is on the truck and will be delivered today.',
        step: 3,
      } as PackageStatus;

    case 'execute_python_code':
        if (!args.code) throw new Error("No code provided to execute.");
        let output = 'Execution successful.\n';
        if (args.code.includes('print')) {
            const match = args.code.match(/print\(([^)]+)\)/);
            if (match) {
                 output += match[1].replace(/['"]/g, '');
            }
        }
        return {
            code: args.code,
            output: output,
        } as ColabResult;
    
    case 'debug_python_code':
        if (!args.code) throw new Error("No code provided to debug.");
        // A simplified debugger simulation
        const lines = args.code.split('\n').filter(l => l.trim() !== '');
        const steps = [];
        const variables: Record<string, any> = {};
        let stepOutput: string | undefined = undefined;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i + 1;
            if (line.includes('=')) {
                const [varName, value] = line.split('=').map(s => s.trim());
                 variables[varName] = eval(value); // Unsafe, but fine for this mock
            } else if (line.startsWith('print')) {
                const match = line.match(/print\(([^)]+)\)/);
                if (match) {
                    stepOutput = match[1] in variables ? variables[match[1]] : match[1].replace(/['"]/g, '');
                }
            }
            steps.push({ lineNumber, variables: { ...variables }, output: stepOutput });
            stepOutput = undefined;
        }
        return { steps, error: null } as DebugResult;

    case 'set_reminder':
        if (!args.reminder_text || !args.time) throw new Error("Reminder text and time are required.");
        return {
            text: args.reminder_text,
            time: args.time,
            formattedTime: `Today at ${args.time}`,
        } as Reminder;
        
    case 'get_calendar_events':
        return {
            events: [
                { summary: 'Team Sync', time: '10:00 AM' },
                { summary: 'Project Phoenix Meeting', time: '2:00 PM' },
                { summary: 'Dentist Appointment', time: '4:30 PM' },
            ]
        };

    case 'play_music':
        if (!args.track && !args.artist) throw new Error("A track or artist is needed to play music.");
        return {
            track: args.track || 'Feeling Good',
            artist: args.artist || 'Nina Simone',
            albumArt: 'https://i.scdn.co/image/ab67616d0000b2738a9a85c271d4d38c35b8162b'
        };
        
    case 'play_youtube_video':
        if (!args.query) throw new Error("A search query is needed to find a video.");
        return {
            videoId: 'dQw4w9WgXcQ'
        };
        
    case 'generate_image':
        // This is handled in App.tsx calling geminiService, but we keep a case here for consistency.
        if (!args.prompt) throw new Error("A prompt is needed to generate an image.");
        // This won't actually be called from the app, which uses the dedicated service.
        return { success: true, prompt: args.prompt };

    case 'respond_to_google_voice':
    case 'respond_to_facebook_messenger':
        if (!args.recipient || !args.message) throw new Error("Recipient and message are required.");
        return {
            recipient: args.recipient,
            message: args.message,
        } as SentMessage;

    case 'book_flight':
        if (!args.destination || !args.departure_date) {
            throw new Error('Destination and departure date are required to book a flight.');
        }
        const airlines = ['United', 'Delta', 'American', 'Southwest'];
        return {
            destination: args.destination,
            departureDate: args.departure_date,
            returnDate: args.return_date,
            price: `$${(200 + Math.random() * 400).toFixed(2)}`,
            airline: airlines[Math.floor(Math.random() * airlines.length)],
        } as FlightDetails;

    default:
      throw new Error(`Tool "${name}" is not implemented in the mock service.`);
  }
};