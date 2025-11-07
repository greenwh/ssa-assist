import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { PassphraseSetup } from './components/Auth/PassphraseSetup';
import { PassphraseUnlock } from './components/Auth/PassphraseUnlock';

function App() {
  const {
    isInitialized,
    isUnlocked,
    isFirstTimeSetup,
    isLoading,
    initialize,
    setupPassphrase,
    unlock,
  } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (isFirstTimeSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome to SSA Form-Assist</h1>
            <p className="text-text-muted">Let's get started by setting up your secure passphrase</p>
          </div>
          <PassphraseSetup
            onComplete={async (_salt) => {
              const passphrase = prompt('Re-enter passphrase to continue (temporary):');
              if (passphrase) {
                await setupPassphrase(passphrase);
              }
            }}
          />
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return <PassphraseUnlock onUnlock={unlock} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">SSA Form-Assist</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-text-muted">
            Your privacy-first AI assistant for completing SSA Adult Function Reports
          </p>
          <div className="bg-success/10 border border-success/20 rounded-md p-4 max-w-md mx-auto">
            <p className="text-success font-semibold">Session Unlocked</p>
            <p className="text-sm text-text-muted mt-1">
              All your data is encrypted and secure
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
