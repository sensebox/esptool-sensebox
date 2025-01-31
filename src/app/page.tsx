'use client'
import BoardSelect from '@/components/pages/BoardSelect'
import { useXTerm } from 'react-xtermjs'
import Image from 'next/image'

export default function Home() {
  const { instance, ref } = useXTerm()

  instance?.onData(data => instance?.write(data))

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="-z-10">
        {/* Gelbe Kreise mit zufälligen Bewegungen */}
        <div className="absolute right-[5%] top-[10%] h-[120px] w-[120px] animate-float1 rounded-full bg-senseboxYellow shadow-lg"></div>
        <div className="delay-[1500ms] absolute bottom-[20%] left-[15%] h-[80px] w-[80px] animate-float2 rounded-full bg-senseboxYellow shadow-lg"></div>

        {/* Blaue Ringe mit individuellen Bewegungen */}
        <div className="delay-[2000ms] absolute left-[-40px] top-[15%] h-[160px] w-[160px] animate-float3 rounded-full border-8 border-senseboxBlue opacity-50"></div>
        <div className="delay-[3000ms] absolute bottom-[10%] right-[5%] h-[200px] w-[200px] animate-float1 rounded-full border-[10px] border-senseboxBlue opacity-50"></div>
        <div className="delay-[4000ms] absolute left-[65%] top-[5%] h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 transform animate-float2 rounded-full border-[6px] border-senseboxBlue opacity-50"></div>
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
          Mit diesem Tool kannst du deine MCU-S2 Over-the-Air (OTA) fähig
          machen!
          <br></br>
          Wähle unten dein Board aus und klicke auf Sketch hochladen!
        </p>
      </div>

      {/* Board- und Terminal-Komponenten */}
      <div className="flex items-center gap-4">
        <div className="h-96 w-96">
          <BoardSelect terminal={instance} />
        </div>
        <div className="h-96 w-96">
          <div className="whitespace-pre-wrap">
            <div ref={ref} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
