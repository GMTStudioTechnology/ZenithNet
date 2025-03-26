import { useState, useEffect, useRef } from "react";

const ChatBotPlayer = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hey! What’s up?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    const newMessages = [...messages, { sender: 'user', text: inputText.trim() }];
    setMessages(newMessages);
    const userInput = inputText.toLowerCase();
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I didn't catch that.";
      
      if (userInput.includes('hello') || userInput.includes('hi')) {
        botResponse = "Hi there! (wave)";
      } else if (userInput.includes('time')) {
        const now = new Date();
        botResponse = `It's ${now.toLocaleTimeString()}.`;
      } else if (userInput.includes('who are you') || userInput.includes('who the hell are you')) {
        botResponse = "I'm your chatbot buddy!";
      } else if (userInput.includes('help')) {
        botResponse = "Ask me anything!";
      }
      
      setMessages([...newMessages, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div
      className={`fixed bottom-4 right-4 flex flex-col transition-all duration-500 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm ${
        expanded
          ? "w-80 h-96 bg-black bg-opacity-90 border border-gray-800"
          : "w-16 h-16 bg-black bg-opacity-80 border border-gray-700"
      }`}
    >
      {/* Minimized Player */}
      {!expanded && (
        <button
          className="flex items-center justify-center w-full h-full text-white hover:bg-gray-900 transition-all"
          onClick={() => setExpanded(true)}
        >
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse mr-1"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-1" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-4 h-4 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </button>
      )}

      {/* Expanded Chatbot */}
      {expanded && (
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h2 className="text-sm font-medium text-gray-200">CHATBOT</h2>
              <span className="text-xs text-green-400">(Online)</span>
            </div>
            <button
              className="text-gray-400 hover:text-white focus:outline-none transform transition hover:rotate-90"
              onClick={() => setExpanded(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3" style={{ scrollBehavior: 'smooth' }}>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-lg transition-transform duration-200 ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none hover:scale-105'
                    : 'bg-gray-800 text-gray-200 rounded-bl-none hover:scale-105'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-800 p-3 bg-gray-900">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 focus:outline-none transition"
                disabled={inputText.trim() === ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>

          {/* Footer with info */}
          <div className="px-3 py-2 text-xs text-gray-500 text-center bg-gray-900 border-t border-gray-800">
            Chatbot
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotPlayer;