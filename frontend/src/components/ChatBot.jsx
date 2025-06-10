import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Bot, User, Sun, Moon, Sparkles, Zap } from "lucide-react";

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode for modern look
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Show welcome message when chat opens for the first time
  useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      setIsTyping(true);
      setTimeout(() => {
        setChat([{
          role: "assistant",
          content: "✨ Hello! I'm Lyria, your advanced AI assistant. Powered by cutting-edge neural networks, I'm here to help you with anything you need. What can we explore together today?",
          timestamp: new Date()
        }]);
        setIsTyping(false);
        setHasShownWelcome(true);
      }, 1200);
    }
  }, [isOpen, hasShownWelcome]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessage = { role: "user", content: userInput, timestamp: new Date() };
    const newChat = [...chat, newMessage];
    setChat(newChat);
    setUserInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: userInput })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || "⚠️ Neural pathways temporarily disrupted. Attempting to reconnect...";

      setChat([...newChat, { 
        role: "assistant", 
        content: reply, 
        timestamp: new Date() 
      }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setChat([
        ...newChat,
        { 
          role: "assistant", 
          content: "🔧 System experiencing quantum fluctuations. Please reinitialize connection and try again.", 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    if (isOpen) {
      setChat([]);
      setHasShownWelcome(false);
    }
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Modern AI Avatar Component
  const LyriaAvatar = ({ size = "w-10 h-10", isLarge = false }) => (
    <div className={`${size} relative`}>
      {/* Outer glow ring */}
      <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'} animate-pulse`}>
      </div>
      {/* Inner avatar */}
      <div className={`relative ${size} rounded-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-2 ${isDarkMode ? 'border-cyan-400/30' : 'border-blue-400/30'} flex items-center justify-center overflow-hidden backdrop-blur-sm`}>
        {/* Neural network pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute top-2 left-2 w-1 h-1 ${isDarkMode ? 'bg-cyan-400' : 'bg-blue-500'} rounded-full animate-ping`}></div>
          <div className={`absolute top-3 right-3 w-0.5 h-0.5 ${isDarkMode ? 'bg-purple-400' : 'bg-purple-500'} rounded-full animate-pulse`}></div>
          <div className={`absolute bottom-2 left-3 w-0.5 h-0.5 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} rounded-full animate-ping`} style={{animationDelay: '0.5s'}}></div>
        </div>
        {/* AI Symbol */}
        <div className={`relative ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
          {isLarge ? (
            <Sparkles className="w-8 h-8" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );

  const themeClasses = {
    chatWindow: isDarkMode 
      ? "bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-cyan-500/10" 
      : "bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl shadow-blue-500/10",
    header: isDarkMode 
      ? "bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-b border-cyan-500/20" 
      : "bg-gradient-to-r from-gray-50/90 to-white/90 backdrop-blur-xl border-b border-blue-500/20",
    headerText: isDarkMode ? "text-gray-100" : "text-gray-800",
    messagesContainer: isDarkMode 
      ? "bg-gradient-to-b from-gray-900/50 to-gray-800/50" 
      : "bg-gradient-to-b from-gray-50/50 to-white/50",
    userMessage: isDarkMode 
      ? "bg-gradient-to-r from-cyan-600/90 to-blue-600/90 backdrop-blur-sm border border-cyan-400/20" 
      : "bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm border border-blue-400/20",
    assistantMessage: isDarkMode 
      ? "bg-gray-800/80 backdrop-blur-sm text-gray-100 border border-gray-600/30" 
      : "bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-300/30",
    input: isDarkMode 
      ? "border-gray-600/50 bg-gray-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:ring-cyan-400/50 focus:border-cyan-400/50" 
      : "border-gray-300/50 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:ring-blue-400/50 focus:border-blue-400/50",
    sendButton: isDarkMode 
      ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:ring-cyan-400/50 shadow-lg shadow-cyan-500/25" 
      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-blue-400/50 shadow-lg shadow-blue-500/25",
    inputArea: isDarkMode 
      ? "bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50" 
      : "bg-white/80 backdrop-blur-xl border-t border-gray-200/50",
    emptyStateText: isDarkMode ? "text-gray-300" : "text-gray-600",
    toggleButton: isDarkMode
      ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25",
    modeToggle: isDarkMode
      ? "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
      : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-600"
  };

  return (
   <div className="fixed bottom-6 right-6 z-50">
  {/* Chat Toggle Button */}
  <button
    onClick={toggleChat}
    className={`relative w-14 h-14 rounded-full transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 focus:outline-none ${
      isOpen 
        ? "bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40"
        : "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
    }`}
  >
    {/* Animated background glow */}
    <div className={`absolute inset-0 rounded-full ${
      isOpen ? 'bg-rose-400/20 animate-pulse' : 'bg-blue-400/20 animate-pulse'
    }`}></div>
    
    <div className="relative flex items-center justify-center h-full">
      {isOpen ? (
        <X className="w-5 h-5 text-white" />
      ) : (
        <MessageCircle className="w-5 h-5 text-white" />
      )}
    </div>
    
    {/* Notification dot */}
    {!isOpen && (
      <div className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full border-2 border-white animate-ping"></div>
    )}
  </button>

  {/* Chat Window */}
  {isOpen && (
    <div className={`absolute bottom-20 right-0 w-80 h-[500px] rounded-xl overflow-hidden shadow-xl transition-all duration-300 ease-out ${
      isDarkMode 
        ? 'bg-gray-800/90 backdrop-blur-md border border-gray-700' 
        : 'bg-white/90 backdrop-blur-md border border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>AI Assistant</h3>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Online now</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-amber-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-blue-500'
              } transition-colors`}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={toggleChat}
              className={`p-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
              } transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className={`h-[calc(100%-120px)] overflow-y-auto p-4 ${
        isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
      }`}>
        {chat.length === 0 && !isTyping ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`p-4 rounded-full mb-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <MessageCircle className={`w-8 h-8 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-500'
              }`} />
            </div>
            <h4 className={`text-lg font-medium mb-1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>How can I help?</h4>
            <p className={`text-sm max-w-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Ask me anything or share your thoughts</p>
          </div>
        ) : (
          <>
            {chat.map((msg, i) => (
              <div key={i} className={`flex mb-4 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}>
                <div className={`max-w-[80%] rounded-xl p-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                    : isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-800"
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.role === "user"
                      ? "text-blue-100"
                      : isDarkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className={`rounded-xl p-3 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                        }`}
                        style={{
                          animation: `bounce 1.5s infinite ${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className={`flex-1 px-4 py-3 text-sm rounded-lg focus:outline-none focus:ring-2 transition-all ${
              isDarkMode
                ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500'
                : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-blue-400'
            }`}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!userInput.trim() || isTyping}
            className={`p-3 rounded-lg transition-all ${
              isTyping || !userInput.trim()
                ? isDarkMode
                  ? 'bg-gray-700 text-gray-500'
                  : 'bg-gray-100 text-gray-400'
                : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}

export default Chatbot;