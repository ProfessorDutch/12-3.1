import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Database } from 'lucide-react';
import { testConnection } from '../../utils/database/testConnection';

export default function ConnectionStatus() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const runConnectionTest = async () => {
    setStatus('loading');
    setError(null);

    try {
      const result = await testConnection();
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(result.error);
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  useEffect(() => {
    runConnectionTest();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 ${
        status === 'error' ? 'bg-red-50 text-red-700' :
        status === 'success' ? 'bg-green-50 text-green-700' :
        'bg-white text-gray-700'
      }`}>
        {status === 'loading' && (
          <Loader2 className="w-5 h-5 animate-spin" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        )}
        {status === 'error' && (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        <Database className="w-5 h-5" />
        
        <div className="flex flex-col">
          <span className="font-medium">
            {status === 'loading' && 'Testing database connection...'}
            {status === 'success' && 'Database connected'}
            {status === 'error' && 'Connection error'}
          </span>
          {error && <span className="text-sm">{error}</span>}
        </div>

        {(status === 'error' || status === 'success') && (
          <button
            onClick={runConnectionTest}
            className="ml-2 px-3 py-1 text-sm rounded-md hover:bg-black/5 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}