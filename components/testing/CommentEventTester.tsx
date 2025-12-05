import { useState } from 'react';

export default function CommentEventTester() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSimulate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/test/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: input,
      });
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Error');
    }
    setLoading(false);
  }

  return (
    <div className="p-4 border rounded bg-white max-w-xl">
      <h2 className="text-lg font-bold mb-2">Comment Event Tester</h2>
      <textarea
        className="textarea textarea-bordered w-full mb-2"
        rows={8}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste a sample Facebook/Instagram comment webhook JSON here"
      />
      <button className="btn btn-primary" onClick={handleSimulate} disabled={loading}>
        {loading ? 'Simulating...' : 'Simulate'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {result && (
        <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
