// Home.tsx
'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Tabs, TabsList, TabsTrigger,TabsContent } from '../ui/tabs'
import Tutorial from './Tutorial'

// Dynamischer Import der TerminalWrapper-Komponente mit deaktiviertem SSR
const TerminalWrapper = dynamic(
  () => import('@/components/pages/TerminalWrapper'),
  { ssr: false },
)

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-start gap-6">
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
        </p>
      </div>

      {/* Hier wird die dynamisch importierte TerminalWrapper-Komponente eingebunden */}
      <Tabs defaultValue="upload" className='w-full'>
        <TabsList className='w-full justify-evenly p-0'>
          <TabsTrigger className='text-2xl w-1/2' value="upload">Upload</TabsTrigger>
          <TabsTrigger className='text-2xl w-1/2' value="tutorial">Anleitung</TabsTrigger>
        </TabsList>
        <div>
        <TabsContent className='' value="upload"><TerminalWrapper/></TabsContent>
        <TabsContent value="tutorial"><Tutorial/></TabsContent>
        </div>

      </Tabs>
    </div>
  )
}
