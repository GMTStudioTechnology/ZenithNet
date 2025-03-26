import { useState, useEffect } from "react";

const MusicPlayer = () => {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState("1:23");
  const [totalTime] = useState("3:45");

  // Mock song data - in a real app, you'd use your actual music data
  const currentSong = {
    title: "Midnight Dreams",
    artist: "Cosmic Waves",
    coverArt: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23333'/%3E%3Ccircle cx='50' cy='50' r='30' fill='%235d42f5'/%3E%3Cpath d='M35 35 L65 65 M35 65 L65 35' stroke='%23fff' stroke-width='2'/%3E%3C/svg%3E"
  };

  // Simulate progress increment when playing
  useEffect(() => {
    // Fix 1: Define interval type as NodeJS.Timeout or number
    let interval: NodeJS.Timeout | undefined;
    
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 0.5;
          if (newProgress >= 100) {
            if (interval) clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, progress]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSong = () => {
    setProgress(0);
    setCurrentTime("0:00");
    setIsPlaying(true);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 flex flex-col transition-all duration-500 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm ${
        expanded
          ? "w-80 h-auto max-h-[600px] bg-black bg-opacity-90 border border-gray-800" // Increased height
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
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-1" style={{animationDelay: "0.2s"}}></div>
            <div className="w-4 h-4 bg-purple-600 rounded-full animate-pulse" style={{animationDelay: "0.4s"}}></div>
          </div>
        </button>
      )}

      {/* Expanded Player */}
      {expanded && (
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-sm font-medium text-gray-400">NOW PLAYING</h2>
            <button
              className="text-gray-400 hover:text-white focus:outline-none transform transition hover:rotate-90"
              onClick={() => setExpanded(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Album artwork */}
          <div className="p-5 flex justify-center">
            <div 
              className={`w-44 h-44 rounded-xl bg-gradient-to-br from-purple-900 to-black shadow-lg overflow-hidden ${isPlaying ? 'animate-pulse-slow' : ''}`}
              style={{
                backgroundImage: `url(${currentSong.coverArt})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)'
              }}
            ></div>
          </div>

          {/* Song info */}
          <div className="px-6 pb-2 text-center">
            <h3 className="text-white font-bold text-lg truncate">{currentSong.title}</h3>
            <p className="text-gray-400 text-sm">{currentSong.artist}</p>
          </div>

          {/* Progress bar */}
          <div className="px-6 py-2">
            <div className="relative h-1 w-full rounded-full overflow-hidden bg-gray-800">
              <div 
                className="absolute h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{currentTime}</span>
              <span>{totalTime}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-6 p-4">
            <button className="text-gray-400 hover:text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </button>
            
            <button 
              className="bg-white rounded-full p-3 text-black hover:bg-gray-200 focus:outline-none transition transform hover:scale-105"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>
            
            <button className="text-gray-400 hover:text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>
          </div>

          {/* Volume control */}
          <div className="px-6 py-2 flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              style={{
                background: `linear-gradient(to right, rgb(124, 58, 237) 0%, rgb(124, 58, 237) ${volume}%, rgb(31, 41, 55) ${volume}%, rgb(31, 41, 55) 100%)`
              }}
            />
          </div>

          {/* Additional controls */}
          <div className="mt-auto border-t border-gray-800 p-3 flex justify-between">
            <button className="text-gray-500 hover:text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 18a5 5 0 0 0-10 0"></path>
                <line x1="12" y1="2" x2="12" y2="9"></line>
                <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                <line x1="1" y1="18" x2="3" y2="18"></line>
                <line x1="21" y1="18" x2="23" y2="18"></line>
                <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
                <line x1="23" y1="22" x2="1" y2="22"></line>
                <polyline points="8 6 12 2 16 6"></polyline>
              </svg>
            </button>
            <button className="text-gray-500 hover:text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
            <button className="text-gray-500 hover:text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </button>
            <button className="text-gray-500 hover:text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
            <button onClick={resetSong} className="text-gray-500 hover:text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;