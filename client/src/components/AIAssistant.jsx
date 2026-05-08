import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, X, Send, Mic, MicOff, Bot, User, Loader2 } from 'lucide-react';

const AIAssistant = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AI Clinical Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  // Initialize Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    }
  }

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      if (recognition) {
        recognition.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare context string from object
      let contextString = '';
      if (contextData && contextData.patient) {
          contextString += `Patient Name: ${contextData.patient.name}\nAge: ${contextData.patient.age}\nGender: ${contextData.patient.gender}\n`;
      }
      if (contextData && contextData.history) {
          contextString += `\nPast Visits:\n${JSON.stringify(contextData.history.visits.map(v => v.diagnosis))}\n`;
      }

      const res = await api.post('/ai/chat', {
        prompt: userMessage,
        context: contextString
      });

      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (error) {
      // FRONTEND FALLBACK: If backend fails or API key is missing, handle it gracefully
      const lowerInput = userMessage.toLowerCase();
      let mockReply = "Based on your prompt, I recommend consulting a doctor. (Note: This is a demo fallback response because the AI API could not be reached).";
      
      if (lowerInput.includes("fever")) {
          mockReply = "For a fever, it's generally recommended to stay hydrated and rest. You may take Paracetamol 500mg (1 tablet every 6 hours) to reduce the fever. If it persists for more than 3 days or exceeds 103°F, consult a doctor immediately.\n\n*(Note: This is a demo fallback response)*";
      } else if (lowerInput.includes("headache")) {
          mockReply = "For a mild headache, rest and hydration are key. Ibuprofen 400mg or Paracetamol 500mg can help. If it is severe, accompanied by vision changes or stiffness in the neck, seek emergency medical care.\n\n*(Note: This is a demo fallback response)*";
      } else if (lowerInput.includes("summarize") || lowerInput.includes("summary") || lowerInput.includes("patient")) {
          mockReply = "Patient Summary: The patient has a history of mild hypertension and seasonal allergies. Recent visits indicate no acute abnormalities. Vitals are stable.\n\n*(Note: This is a demo fallback response)*";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: mockReply }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 z-40 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 border border-gray-100" style={{ height: '500px', maxHeight: 'calc(100vh - 4rem)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <h3 className="font-bold">Clinical AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="self-start flex gap-2 max-w-[85%]">
                 <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white border rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t flex gap-2 items-end">
             <button
              type="button"
              onClick={toggleListen}
              className={`p-3 rounded-xl flex-shrink-0 transition ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              title="Voice to text"
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <form onSubmit={handleSend} className="flex-1 flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for diagnoses, summaries, or drafts..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 resize-none outline-none focus:ring-2 focus:ring-indigo-500 text-sm max-h-32 min-h-[44px]"
                rows={1}
                onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 h-[44px] flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
