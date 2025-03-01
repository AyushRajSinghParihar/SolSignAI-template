'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

type TemplateVariables = {
  dates: string[];
  emails: string[];
  names: string[];
};

export default function Home() {
  const { publicKey, connect } = useWallet();
  const [file, setFile] = useState<File | null>(null);
  const [template, setTemplate] = useState<string | null>(null);
  const [variables, setVariables] = useState<TemplateVariables | null>(null);

  const handleUpload = useCallback(async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/process-document', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json() as { template: string; variables: TemplateVariables };
      setTemplate(data.template);
      setVariables(data.variables);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [file]);

  return (
    <div className="min-h-screen p-8">
      <input 
        type="file" 
        accept=".pdf,.docx" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
      />
      <button onClick={() => connect().catch(console.error)}>
        Connect Wallet
      </button>
      <button onClick={handleUpload} disabled={!file}>
        Create Template
      </button>
      
      {variables && (
        <div>
          <h3>Detected Variables:</h3>
          <pre>{JSON.stringify(variables, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}