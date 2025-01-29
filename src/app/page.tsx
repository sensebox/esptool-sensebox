import BoardSelect from '@/components/pages/BoardSelect'
import TerminalLogs from '@/components/ui/TerminalLogs'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="yellow-circle one"></div>
      <div className="yellow-circle two"></div>

      <div className="blue-ring one"></div>
      <div className="blue-ring two"></div>
      <div className="blue-ring three"></div>

      <Image
        src="/sensebox_logo.png"
        alt="senseBox"
        width={200}
        height={200}
        className="rounded-lg bg-white"
      />
      {/* Willkommensnachricht */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">
          Willkommen zum senseBox Sketch-Upload!
        </h1>
        <p className="mt-2 text-xl font-semibold">
          Mit diesem Tool kannst du deine MCU-S2 Over-the-Air(OTA) fähig machen!
          <br></br>
          Wähle unten dein Board aus und klicke auf Sketch hochladen!
        </p>
      </div>

      {/* Board- und Terminal-Komponenten */}
      <div className="flex items-center gap-4">
        <div className="h-96 w-96">
          <BoardSelect />
        </div>
        <div className="h-96 w-96">
          <TerminalLogs logs="Logs werden hier gezeigt.." />
        </div>
      </div>
    </div>
  )
}
