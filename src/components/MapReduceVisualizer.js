import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Database, Cpu, ArrowRight, CheckCircle } from 'lucide-react';

const MapReduceVisualizer = () => {
  const [text, setText] = useState(`Distributed computing is a field of computer science that studies distributed systems. A distributed system is a system whose components are located on different networked computers which communicate and coordinate their actions by passing messages to one another. The components interact with one another in order to achieve a common goal.`);
  const [numNodes, setNumNodes] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle, splitting, mapping, reducing, complete
  const [mapProgress, setMapProgress] = useState([]);
  const [reduceProgress, setReduceProgress] = useState([]);
  const [results, setResults] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };

  const splitText = (text, numChunks) => {
    const words = text.trim().split(/\s+/);
    const chunkSize = Math.floor(words.length / numChunks);
    const chunks = [];
    
    for (let i = 0; i < numChunks; i++) {
      if (i === numChunks - 1) {
        chunks.push(words.slice(i * chunkSize).join(' '));
      } else {
        chunks.push(words.slice(i * chunkSize, (i + 1) * chunkSize).join(' '));
      }
    }
    return chunks;
  };

  const countWords = (text) => {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const counts = {};
    words.forEach(word => {
      counts[word] = (counts[word] || 0) + 1;
    });
    return counts;
  };

  const runMapReduce = async () => {
    setIsRunning(true);
    setPhase('splitting');
    setLogs([]);
    addLog('Starting MapReduce cluster...');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Split text
    addLog(`Splitting text across ${numNodes} nodes...`);
    const textChunks = splitText(text, numNodes);
    setChunks(textChunks);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // MAP Phase
    setPhase('mapping');
    addLog('Phase 1: MAP - Processing chunks...');
    const mapResults = [];
    
    for (let i = 0; i < numNodes; i++) {
      setMapProgress(prev => [...prev, { node: i + 1, status: 'processing' }]);
      addLog(`[Node ${i + 1}] Starting MAP phase...`);
      
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      
      const wordCount = countWords(textChunks[i]);
      mapResults.push(wordCount);
      
      const totalWords = textChunks[i].split(/\s+/).length;
      addLog(`[Node ${i + 1}] MAP complete. Found ${totalWords} words, ${Object.keys(wordCount).length} unique`);
      
      setMapProgress(prev => 
        prev.map((p, idx) => idx === i ? { ...p, status: 'complete', count: Object.keys(wordCount).length } : p)
      );
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    addLog(`MAP phase complete. Collected results from ${mapResults.length} nodes`);
    
    // REDUCE Phase
    setPhase('reducing');
    addLog('Phase 2: REDUCE - Combining results...');
    
    const numReducers = Math.min(2, numNodes);
    const resultsPerReducer = Math.ceil(mapResults.length / numReducers);
    
    for (let i = 0; i < numReducers; i++) {
      setReduceProgress(prev => [...prev, { reducer: i + 1, status: 'processing' }]);
      addLog(`[Reducer ${i + 1}] Starting REDUCE phase...`);
      
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
      
      addLog(`[Reducer ${i + 1}] REDUCE complete`);
      setReduceProgress(prev => 
        prev.map((p, idx) => idx === i ? { ...p, status: 'complete' } : p)
      );
    }
    
    // Combine all results
    const finalCount = {};
    mapResults.forEach(result => {
      Object.entries(result).forEach(([word, count]) => {
        finalCount[word] = (finalCount[word] || 0) + count;
      });
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setPhase('complete');
    addLog('REDUCE phase complete');
    addLog(`Total unique words: ${Object.keys(finalCount).length}`);
    addLog(`Total word count: ${Object.values(finalCount).reduce((a, b) => a + b, 0)}`);
    
    const sortedResults = Object.entries(finalCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
    
    setResults({
      total: Object.keys(finalCount).length,
      totalCount: Object.values(finalCount).reduce((a, b) => a + b, 0),
      top: sortedResults
    });
    
    setIsRunning(false);
  };

  const reset = () => {
    setPhase('idle');
    setMapProgress([]);
    setReduceProgress([]);
    setResults(null);
    setChunks([]);
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            MapReduce Cluster Visualizer
          </h1>
          <p className="text-gray-400">Watch distributed word counting in action</p>
        </div>

        {/* Configuration */}
        <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Configuration
          </h2>
          
          <div className="grid gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Input Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isRunning}
                className="w-full h-32 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm disabled:opacity-50"
                placeholder="Enter text to process..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Nodes: {numNodes}
              </label>
              <input
                type="range"
                min="2"
                max="8"
                value={numNodes}
                onChange={(e) => setNumNodes(parseInt(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={runMapReduce}
              disabled={isRunning || !text.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-all"
            >
              <Play className="w-4 h-4" />
              Run MapReduce
            </button>
            
            <button
              onClick={reset}
              disabled={isRunning}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 px-6 py-2 rounded-lg font-medium transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Visualization */}
        {phase !== 'idle' && (
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* MAP Phase */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                MAP Phase {phase === 'mapping' && <span className="text-sm text-blue-400 animate-pulse">(Processing...)</span>}
                {(phase === 'reducing' || phase === 'complete') && <CheckCircle className="w-5 h-5 text-green-400" />}
              </h3>
              
              <div className="space-y-3">
                {Array.from({ length: numNodes }).map((_, i) => {
                  const progress = mapProgress.find(p => p.node === i + 1);
                  return (
                    <div key={i} className="bg-slate-900 rounded p-3 border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Node {i + 1}</span>
                        {progress?.status === 'processing' && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Processing</span>
                        )}
                        {progress?.status === 'complete' && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Complete
                          </span>
                        )}
                      </div>
                      {chunks[i] && (
                        <div className="text-xs text-gray-400 mb-2 truncate">
                          {chunks[i].substring(0, 60)}...
                        </div>
                      )}
                      {progress?.count && (
                        <div className="text-xs text-purple-400">
                          {progress.count} unique words
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REDUCE Phase */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-purple-400" />
                REDUCE Phase {phase === 'reducing' && <span className="text-sm text-purple-400 animate-pulse">(Processing...)</span>}
                {phase === 'complete' && <CheckCircle className="w-5 h-5 text-green-400" />}
              </h3>
              
              <div className="space-y-3">
                {reduceProgress.map((progress, i) => (
                  <div key={i} className="bg-slate-900 rounded p-3 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Reducer {progress.reducer}</span>
                      {progress.status === 'processing' && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Processing</span>
                      )}
                      {progress.status === 'complete' && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Complete
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {results && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Unique Words:</span>
                      <span className="font-semibold text-blue-400">{results.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Word Count:</span>
                      <span className="font-semibold text-purple-400">{results.totalCount}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700 mb-6">
            <h3 className="text-xl font-semibold mb-4">Top 15 Most Frequent Words</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 px-3">Rank</th>
                    <th className="text-left py-2 px-3">Word</th>
                    <th className="text-right py-2 px-3">Count</th>
                    <th className="text-right py-2 px-3">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {results.top.map(([word, count], i) => (
                    <tr key={word} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-2 px-3 text-gray-400">#{i + 1}</td>
                      <td className="py-2 px-3 font-mono text-blue-400">{word}</td>
                      <td className="py-2 px-3 text-right font-semibold">{count}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${(count / results.top[0][1]) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-12">
                            {((count / results.totalCount) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Cluster Logs</h3>
            <div className="bg-slate-900 rounded p-4 h-64 overflow-y-auto font-mono text-xs">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">
                  <span className="text-gray-500">[{log.time}]</span>{' '}
                  <span className="text-green-400">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapReduceVisualizer;