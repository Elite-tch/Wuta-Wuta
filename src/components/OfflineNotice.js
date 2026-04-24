import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineNotice = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {(isOffline || showStatus) && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className={`fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 p-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-center justify-between gap-4 max-w-sm ${
            isOffline 
              ? 'bg-red-500/10 border-red-500/20 text-red-500' 
              : 'bg-green-500/10 border-green-500/20 text-green-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isOffline ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
              {isOffline ? <WifiOff size={20} /> : <Wifi size={20} />}
            </div>
            <div>
              <p className="font-semibold text-sm">
                {isOffline ? 'You are currently offline' : 'Back online'}
              </p>
              <p className="text-xs opacity-80">
                {isOffline 
                  ? 'Caching is active. Some features may be limited.' 
                  : 'Syncing your changes with the server...'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowStatus(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineNotice;
