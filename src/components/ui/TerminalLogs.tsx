'use client'
import { Terminal } from '@xterm/xterm'
import { useEffect, useState } from 'react'

interface TerminalLogsProps {
  logs: string
  terminal: Terminal | null
}

export default function TerminalLogs({ logs }: TerminalLogsProps) {
  const [logLines, setLogLines] = useState<string[]>([])

  useEffect(() => {
    setLogLines(logs.split('\n'))
  }, [logs])

  return (
    <div className="flex h-96 w-full max-w-lg flex-col overflow-auto rounded-md border border-gray-700 bg-black p-4 font-mono text-green-400 shadow-md">
      <div className="whitespace-pre-wrap">
        {logLines.map((line, index) => (
          <div key={index} className="leading-relaxed">
            <span className="text-senseboxYellow">$</span> {line}
          </div>
        ))}
      </div>
    </div>
  )
}
