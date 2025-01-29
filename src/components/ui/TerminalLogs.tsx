'use client'
import { useEffect, useState } from "react";

interface TerminalLogsProps {
  logs: string;
}

export default function TerminalLogs({ logs }: TerminalLogsProps) {
  const [logLines, setLogLines] = useState<string[]>([]);

  useEffect(() => {
    setLogLines(logs.split("\n"));
  }, [logs]);

  return (
    <div className="w-full max-w-lg bg-black text-green-400 font-mono p-4 rounded-md shadow-md overflow-auto h-96 border border-gray-700 flex flex-col flex-col-reverse">
      <div className="whitespace-pre-wrap">
        {logLines.map((line, index) => (
          <div key={index} className="leading-relaxed">
            <span className="text-senseboxYellow">$</span> {line}
          </div>
        ))}
      </div>
    </div>
  );
}
