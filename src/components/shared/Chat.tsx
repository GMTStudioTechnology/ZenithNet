import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define message type for better type safety
interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const ChatBotPlayer = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'bot', 
      text: 'Hey! I\'m your ZenithNet assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<'purple' | 'blue' | 'green' | 'pink'>('purple');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Theme colors mapping
  const themeColors = {
    purple: {
      primary: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      ring: 'focus:ring-purple-500',
      text: 'text-purple-500',
      border: 'border-purple-500',
      gradient: 'from-purple-600 to-indigo-700',
      dot: 'bg-purple-500',
    },
    blue: {
      primary: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      ring: 'focus:ring-blue-500',
      text: 'text-blue-500',
      border: 'border-blue-500',
      gradient: 'from-blue-600 to-cyan-700',
      dot: 'bg-blue-500',
    },
    green: {
      primary: 'bg-emerald-600',
      hover: 'hover:bg-emerald-700',
      ring: 'focus:ring-emerald-500',
      text: 'text-emerald-500',
      border: 'border-emerald-500',
      gradient: 'from-emerald-600 to-teal-700',
      dot: 'bg-emerald-500',
    },
    pink: {
      primary: 'bg-pink-600',
      hover: 'hover:bg-pink-700',
      ring: 'focus:ring-pink-500',
      text: 'text-pink-500',
      border: 'border-pink-500',
      gradient: 'from-pink-600 to-rose-700',
      dot: 'bg-pink-500',
    },
  };

  const currentTheme = themeColors[theme];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    const newMessage: Message = {
      id: generateUniqueId(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    const userInput = inputText.toLowerCase();
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking and typing
    setTimeout(() => {
      let botResponse = "I didn't quite understand that. Could you rephrase?";
      
      if (userInput.includes('hello') || userInput.includes('hi')) {
        botResponse = "Hello there! 👋 How can I assist you today?";
      } else if (userInput.includes('time')) {
        const now = new Date();
        botResponse = `It's currently ${now.toLocaleTimeString()} in your local time zone.`;
      } else if (userInput.includes('who are you') || userInput.includes('what are you')) {
        botResponse = "I'm your ZenithNet assistant, designed to help you navigate and make the most of our platform. Feel free to ask me anything!";
      } else if (userInput.includes('help')) {
        botResponse = "I can help with various tasks! Try asking about features, how to use specific tools, or any general questions about ZenithNet.";
      } else if (userInput.includes('thank')) {
        botResponse = "You're very welcome! 😊 Is there anything else I can help with?";
      } else if (userInput.includes('feature') || userInput.includes('can you do')) {
        botResponse = "I can answer questions, provide information about ZenithNet, help troubleshoot issues, and guide you through our platform's features. What specifically would you like to know?";
      } else if (userInput.includes('theme') || userInput.includes('color')) {
        botResponse = "You can change my theme by clicking the color palette icon in the chat header!";
      }
      
      const botMessage: Message = {
        id: generateUniqueId(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, botMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 500); // Random delay between 500-1500ms for more natural feel
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const cycleTheme = () => {
    const themes: Array<'purple' | 'blue' | 'green' | 'pink'> = ['purple', 'blue', 'green', 'pink'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const clearChat = () => {
    setMessages([
      { 
        id: generateUniqueId(), 
        sender: 'bot', 
        text: 'Chat history cleared. How can I help you now?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-4 right-4 flex flex-col rounded-2xl shadow-2xl overflow-hidden z-50`}
      style={{ 
        width: expanded ? '350px' : '60px', 
        height: expanded ? '500px' : '60px',
        transition: 'width 0.3s ease-out, height 0.3s ease-out'
      }}
    >
      {/* Glass morphism effect */}
      <div className={`absolute inset-0 backdrop-blur-lg bg-gradient-to-br ${currentTheme.gradient} opacity-10 z-0`}></div>
      
      <div className={`absolute inset-0 bg-black bg-opacity-80 border ${expanded ? 'border-gray-700' : 'border-gray-800'} rounded-2xl z-10`}></div>
      
      {/* Minimized Player */}
      {!expanded && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-full h-full text-white hover:bg-gray-900 transition-all relative z-20"
          onClick={() => setExpanded(true)}
        >
          <div className="flex items-center">
            <div className={`w-3 h-3 ${currentTheme.dot} rounded-full animate-pulse mr-1`}></div>
            <div className={`w-2 h-2 ${currentTheme.dot} opacity-80 rounded-full animate-pulse mr-1`} style={{ animationDelay: "0.2s" }}></div>
            <div className={`w-4 h-4 ${currentTheme.dot} opacity-90 rounded-full animate-pulse`} style={{ animationDelay: "0.4s" }}></div>
          </div>
        </motion.button>
      )}

      {/* Expanded Chatbot */}
      {expanded && (
        <div className="flex flex-col h-full relative z-20">
          {/* Header with controls */}
          <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900 bg-opacity-60">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className={`w-3 h-3 ${currentTheme.dot} rounded-full absolute -top-1 -right-1 animate-ping opacity-75`}></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${currentTheme.text}`}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h2 className="text-sm font-medium text-gray-200">ZENITH ASSISTANT</h2>
              <span className="text-xs text-green-400 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                Online
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Theme switcher */}
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                onClick={cycleTheme}
                className="text-gray-400 hover:text-white focus:outline-none p-1"
                title="Change theme"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="21.17" y1="8" x2="12" y2="8"></line>
                  <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                  <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                </svg>
              </motion.button>
              
              {/* Clear chat */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={clearChat}
                className="text-gray-400 hover:text-white focus:outline-none p-1"
                title="Clear chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </motion.button>
              
              {/* Minimize button */}
              <motion.button
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400 hover:text-white focus:outline-none p-1"
                onClick={() => setExpanded(false)}
                title="Minimize"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Messages area */}
          <div 
            ref={messageContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent" 
            style={{ scrollBehavior: 'smooth' }}
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div 
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className="flex flex-col">
                    {message.sender === 'bot' && (
                      <span className="text-xs text-gray-500 ml-2 mb-1">Assistant • {formatTime(message.timestamp)}</span>
                    )}
                    
                    <div 
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-md transition-all duration-200 ${
                        message.sender === 'user'
                          ? `${currentTheme.primary} text-white rounded-br-none group-hover:shadow-lg`
                          : 'bg-gray-800 bg-opacity-80 text-gray-200 rounded-bl-none group-hover:shadow-lg'
                      }`}
                    >
                      {message.text}
                    </div>
                    
                    {message.sender === 'user' && (
                      <span className="text-xs text-gray-500 text-right mr-2 mt-1">You • {formatTime(message.timestamp)}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-800 bg-opacity-80 text-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-md">
                  <div className="flex space-x-1.5">
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    ></motion.div>
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    ></motion.div>
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-800 p-3 bg-gray-900 bg-opacity-60">
            <div className="flex items-center space-x-2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex-1"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className={`w-full bg-gray-800 bg-opacity-70 text-white border border-gray-700 rounded-full px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 ${currentTheme.ring} placeholder-gray-500 transition-all duration-200`}
                />
                {inputText.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setInputText('')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </motion.button>
                )}
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className={`${currentTheme.primary} text-white p-2.5 rounded-full ${currentTheme.hover} focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={inputText.trim() === ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Footer with info */}
          <div className="px-3 py-2 text-xs text-gray-500 text-center bg-gray-900 bg-opacity-60 border-t border-gray-800">
            ZenithNet Assistant • Powered by AI
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChatBotPlayer;