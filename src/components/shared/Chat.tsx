import { useState, useEffect, useRef } from "react";

const ChatBotPlayer = () => {
  const [expanded, setExpanded] = useState(true);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hey! Whats up?' },
    { sender: 'bot', text: "I'm your AI assistant. How can I help you today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState('purple'); // 'purple', 'blue', 'green', 'pink'
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Theme color mapping
  const themeColors = {
    purple: {
      primary: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      accent: 'text-purple-500',
      ring: 'focus:ring-purple-500',
      light: 'bg-purple-400',
      dark: 'bg-purple-800',
      gradient: 'from-purple-600 to-indigo-800'
    },
    blue: {
      primary: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      accent: 'text-blue-500',
      ring: 'focus:ring-blue-500',
      light: 'bg-blue-400',
      dark: 'bg-blue-800',
      gradient: 'from-blue-600 to-cyan-800'
    },
    green: {
      primary: 'bg-emerald-600',
      hover: 'hover:bg-emerald-700',
      accent: 'text-emerald-500',
      ring: 'focus:ring-emerald-500',
      light: 'bg-emerald-400',
      dark: 'bg-emerald-800',
      gradient: 'from-emerald-600 to-teal-800'
    },
    pink: {
      primary: 'bg-pink-600',
      hover: 'hover:bg-pink-700',
      accent: 'text-pink-500',
      ring: 'focus:ring-pink-500',
      light: 'bg-pink-400',
      dark: 'bg-pink-800',
      gradient: 'from-pink-600 to-rose-800'
    }
  };

  // Fix: Explicitly type the theme variable for indexing
  const currentTheme = themeColors[theme as keyof typeof themeColors];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add a nice pulse animation when the bot is typing
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.classList.add('pulse-subtle');
          setTimeout(() => {
            messageContainerRef.current?.classList.remove('pulse-subtle');
          }, 300);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTyping]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    const newMessages = [...messages, { sender: 'user', text: inputText.trim() }];
    setMessages(newMessages);
    const userInput = inputText.toLowerCase();
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I didn't catch that. Could you try rephrasing?";
      
      if (userInput.includes('hello') || userInput.includes('hi')) {
        botResponse = "Hi there! 👋 How can I assist you today?";
      } else if (userInput.includes('time')) {
        const now = new Date();
        botResponse = `It's ${now.toLocaleTimeString()}. Need help with scheduling something?`;
      } else if (userInput.includes('who are you') || userInput.includes('who the hell are you')) {
        botResponse = "I'm your AI assistant, designed to be helpful, harmless, and honest. Ask me anything!";
      } else if (userInput.includes('help')) {
        botResponse = "I can help with information, answer questions, generate creative content, or just chat. What's on your mind?";
      } else if (userInput.includes('theme')) {
        const nextTheme = theme === 'purple' ? 'blue' : 
                          theme === 'blue' ? 'green' : 
                          theme === 'green' ? 'pink' : 'purple';
        setTheme(nextTheme);
        botResponse = `Theme changed to ${nextTheme}. How does it look?`;
      } else if (userInput.includes('thank')) {
        botResponse = "You're welcome! I'm happy to help. Anything else you need?";
      }
      
      setMessages([...newMessages, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, Math.random() * 1000 + 500); // Random delay for more natural feel
  };

  // Fix: Added parameter to the handleKeyPress function
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const cycleTheme = () => {
    const themes = ['purple', 'blue', 'green', 'pink'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 flex flex-col transition-all duration-500 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm ${
        expanded
          ? "w-[340px] sm:w-96 h-[500px] sm:h-[600px] bg-black bg-opacity-90 border border-gray-800"
          : "w-16 h-16 bg-black bg-opacity-90 border border-gray-800"
      }`}
      style={{
        boxShadow: expanded ? `0 0 30px 5px rgba(${theme === 'purple' ? '128, 90, 213' : 
                                              theme === 'blue' ? '59, 130, 246' :
                                              theme === 'green' ? '16, 185, 129' : 
                                              '236, 72, 153'}, 0.2)` : 'none'
      }}
    >
      {/* Minimized Player */}
      {!expanded && (
        <button
          className={`flex items-center justify-center w-full h-full text-white hover:bg-gray-900 transition-all`}
          onClick={() => setExpanded(true)}
        >
          <div className="flex items-center justify-center relative">
            <div className={`absolute w-6 h-6 ${currentTheme.primary} rounded-full opacity-30 animate-ping`}></div>
            <div className={`w-4 h-4 ${currentTheme.primary} rounded-full z-10`}></div>
          </div>
        </button>
      )}

      {/* Expanded Chatbot */}
      {expanded && (
        <div className="flex flex-col h-full relative">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black opacity-40 pointer-events-none"></div>
          
          {/* Header with close button */}
          <div className={`relative z-10 flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r ${currentTheme.gradient}`}>
            <div className="flex items-center space-x-2">
              <div className="relative flex items-center justify-center">
                <div className={`w-3 h-3 ${currentTheme.light} rounded-full animate-pulse mr-1`}></div>
                <div className={`w-2 h-2 ${currentTheme.dark} rounded-full animate-pulse mr-1`} style={{ animationDelay: "0.2s" }}></div>
                <div className={`w-4 h-4 ${currentTheme.primary} rounded-full animate-pulse`} style={{ animationDelay: "0.4s" }}></div>
              </div>
              <h2 className="text-sm font-bold text-white tracking-wider">MazsAI Chat</h2>
              <span className="text-xs bg-black bg-opacity-30 text-green-400 px-2 py-0.5 rounded-full">ONLINE</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={cycleTheme}
                className="text-white opacity-70 hover:opacity-100 focus:outline-none p-1"
                title="Change theme"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>
                </svg>
              </button>
              <button
                className="text-white opacity-70 hover:opacity-100 focus:outline-none transform transition hover:rotate-90 p-1"
                onClick={() => setExpanded(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages area - Fixed to hide scrollbar while maintaining functionality */}
          <div 
            ref={messageContainerRef}
            className="relative z-10 flex-1 p-4 overflow-y-auto space-y-3 scrollbar-hide" 
            style={{ 
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none', /* IE and Edge */
              scrollbarWidth: 'none', /* Firefox */
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Custom style to hide scrollbar in WebKit browsers */}
            <style>
              {`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
            
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.sender === 'bot' && (
                  <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center mr-2 mt-1">
                    <div className={`h-5 w-5 ${currentTheme.accent}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                      </svg>
                    </div>
                  </div>
                )}
                
                <div 
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-md transition-all duration-200 ${
                    message.sender === 'user'
                      ? `${currentTheme.primary} text-white rounded-br-none hover:scale-[1.02]`
                      : 'bg-gray-800 text-gray-100 rounded-bl-none hover:scale-[1.02] border border-gray-700'
                  }`}
                >
                  <div className="text-sm sm:text-base leading-relaxed">{message.text}</div>
                </div>
                
                {message.sender === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center ml-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center mr-2">
                  <div className={`h-5 w-5 ${currentTheme.accent}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                  </div>
                </div>
                <div className="bg-gray-800 border border-gray-700 text-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-md">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
          </div>

          {/* Input area */}
          <div className="relative z-10 border-t border-gray-800 p-4 bg-black bg-opacity-95">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message MazsAI T1"
                className={`flex-1 bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none ${currentTheme.ring} focus:ring-2 transition-shadow text-sm`}
              />
              <button
                onClick={handleSendMessage}
                className={`${currentTheme.primary} text-white p-3 rounded-xl ${inputText.trim() === '' ? 'opacity-50 cursor-not-allowed' : currentTheme.hover} focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${currentTheme.ring}`}
                disabled={inputText.trim() === ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            
            {/* Quick action buttons - Fixed to hide scrollbar while maintaining functionality */}
            <div 
              className="flex mt-3 space-x-2 overflow-x-auto pb-1 scrollbar-hide" 
              style={{ 
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <button 
                onClick={() => setInputText("Hello there!")}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              >
                👋 Say hello
              </button>
              <button 
                onClick={() => setInputText("What time is it?")}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              >
                🕒 Check time
              </button>
              <button 
                onClick={() => setInputText("Who are you?")}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              >
                🤔 Your identity
              </button>
              <button 
                onClick={() => setInputText("Change theme")}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              >
                🎨 Change theme
              </button>
            </div>
          </div>

          {/* Footer with branding */}
          <div className="relative z-10 px-4 py-2 text-xs text-gray-500 text-center bg-black border-t border-gray-800 flex items-center justify-between">
            <span>MazsAI T1 </span>
            <span>Powered by <span className={currentTheme.accent}>MazsAI</span></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotPlayer;