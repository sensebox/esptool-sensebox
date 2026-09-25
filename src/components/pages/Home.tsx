// Home.tsx
'use client'
import Image from 'next/image'
import { FlashTool } from "@sensebox/flash-tool";
import "@sensebox/flash-tool/style.css";
import type { Sketch } from '@/lib/sketches'


export default function Home({ sketch }: { sketch?: Sketch }) {
  // Keep the URL in sync with the dropdown so it can be shared as a permalink
  const handleSketchChange = (type: string) => {
    window.history.replaceState(null, '', `/${type}`)
  }

  return (
    <div className="flex h-screen flex-col items-center justify-start gap-6">
      <div className="-z-10">
        {/* Gelbe Kreise mit zufälligen Bewegungen */}
        <div className="absolute right-[5%] top-[10%] h-[120px] w-[120px] animate-float1 rounded-full bg-senseboxYellow shadow-lg"></div>
        <div className="absolute bottom-[20%] left-[15%] h-[80px] w-[80px] animate-float2 rounded-full bg-senseboxYellow shadow-lg delay-[1500ms]"></div>

        {/* Blaue Ringe mit individuellen Bewegungen */}
        <div className="absolute left-[-40px] top-[15%] h-[160px] w-[160px] animate-float3 rounded-full border-8 border-senseboxBlue opacity-50 delay-[2000ms]"></div>
        <div className="absolute bottom-[10%] right-[5%] h-[200px] w-[200px] animate-float1 rounded-full border-[10px] border-senseboxBlue opacity-50 delay-[3000ms]"></div>
        <div className="absolute left-[65%] top-[5%] h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 transform animate-float2 rounded-full border-[6px] border-senseboxBlue opacity-50 delay-[4000ms]"></div>
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
        </p>
      </div>
    <FlashTool
      language="de"
      expand={true}
      defaultFirmwareType={sketch}
      onFirmwareTypeChange={handleSketchChange}
    />
    </div>
  )
}
