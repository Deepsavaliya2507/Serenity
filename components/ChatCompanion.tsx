import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { streamChatResponse } from '../services/geminiService';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatCompanionProps {
  initialMessage?: string;
}

const ChatCompanion: React.FC<ChatCompanionProps> = ({ initialMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: initialMessage || "Hello. I'm Serenity. I'm here to listen without judgment. How are you feeling today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const botMsgId = (Date.now() + 1).toString();
    const botMsg: ChatMessage = {
      id: botMsgId,
      role: 'model',
      text: '',
      isStreaming: true
    };
    
    setMessages(prev => [...prev, botMsg]);

    let fullResponse = '';

    await streamChatResponse(
      messages,
      userMsg.text,
      (chunk) => {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
        ));
      }
    );

    setMessages(prev => prev.map(msg => 
        msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
    ));
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen bg-white md:rounded-3xl shadow-sm overflow-hidden animate-fade-in relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-serenity-100 p-2 rounded-full">
            <Bot size={20} className="text-serenity-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Serenity</h2>
            <p className="text-xs text-green-500 font-medium">Always here for you</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 md:pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-serenity-600 text-white rounded-tr-none'
                  : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none'
              }`}
            >
              <div className="text-sm leading-relaxed markdown-content">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
                {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse align-middle" />}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white absolute bottom-0 w-full md:relative">
        <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-serenity-200 focus-within:border-transparent transition-all">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 p-4 max-h-32 min-h-[56px] resize-none text-gray-700"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 mr-2 rounded-xl transition-all ${
              inputValue.trim() && !isLoading
                ? 'bg-serenity-500 text-white shadow-md hover:bg-serenity-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          Serenity is an AI companion, not a human. In a crisis? Call 988.
        </p>
      </div>
    </div>
  );
};

export default ChatCompanion;