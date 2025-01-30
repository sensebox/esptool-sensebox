import BoardSelect from '@/components/pages/BoardSelect'
import TerminalLogs from '@/components/ui/TerminalLogs'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="-z-10">
        {/* Gelbe Kreise mit zufälligen Bewegungen */}
        <div className="animate-float1 absolute right-[5%] top-[10%] h-[120px] w-[120px] rounded-full bg-senseboxYellow shadow-lg"></div>
        <div className="animate-float2 delay-[1500ms] absolute bottom-[20%] left-[15%] h-[80px] w-[80px] rounded-full bg-senseboxYellow shadow-lg"></div>

        {/* Blaue Ringe mit individuellen Bewegungen */}
        <div className="animate-float3 delay-[2000ms] absolute left-[-40px] top-[15%] h-[160px] w-[160px] rounded-full border-8 border-senseboxBlue opacity-50"></div>
        <div className="animate-float1 delay-[3000ms] absolute bottom-[10%] right-[5%] h-[200px] w-[200px] rounded-full border-[10px] border-senseboxBlue opacity-50"></div>
        <div className="animate-float2 delay-[4000ms] absolute left-[65%] top-[5%] h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border-[6px] border-senseboxBlue opacity-50"></div>
      </div>

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
