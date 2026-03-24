import React, { useEffect } from 'react';
import { NotificationContainer } from './components/ui/ToastNotification';
import TransactionMonitor from './components/ui/TransactionMonitor';
import { useTransactionNotificationStore } from './store/transactionNotificationStore';

const App = ({ children }) => {
  const { clearCompletedTransactions } = useTransactionNotificationStore();

  // Clean up completed transactions on app mount and periodically
  useEffect(() => {
    // Initial cleanup
    clearCompletedTransactions();

    // Periodic cleanup every 5 minutes
    const cleanupInterval = setInterval(() => {
      clearCompletedTransactions();
    }, 5 * 60 * 1000);

    return () => clearInterval(cleanupInterval);
  }, [clearCompletedTransactions]);

  return (
    <>
      {children}
      <NotificationContainer />
      <TransactionMonitor position="bottom-right" maxVisible={3} />
    </>
  );
};

export default App;