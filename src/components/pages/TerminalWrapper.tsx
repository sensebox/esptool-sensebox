// TerminalWrapper.tsx
'use client'
import { useEffect } from 'react'
import { useXTerm } from 'react-xtermjs'
import BoardSelect from '@/components/pages/BoardSelect'

export default function TerminalWrapper() {
  const { instance, ref } = useXTerm()

  // Leitet eingehende Daten an das Terminal weiter.
  useEffect(() => {
    if (instance) {
      instance.onData(data => instance.write(data))
    }
  }, [instance])

  return (
    <div className="flex items-center gap-4">
      {/* BoardSelect-Komponente erhält den xterm instance */}
      <div className="h-96 w-96">
        <BoardSelect terminal={instance} />
      </div>

      {/* Anzeige des Terminals */}
      <div className="h-96 w-96">
        <div className="whitespace-pre-wrap">
          <div ref={ref} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  )
}
