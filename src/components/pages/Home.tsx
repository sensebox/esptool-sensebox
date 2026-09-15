// Home.tsx
'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import Tutorial from './Tutorial'
import { useState, useEffect } from 'react'
import { cva } from 'class-variance-authority'
import { FlashTool } from "@sensebox/flash-tool";
import "@sensebox/flash-tool/style.css";

// Dynamischer Import der TerminalWrapper-Komponente mit deaktiviertem SSR
const TerminalWrapper = dynamic(
  () => import('@/components/pages/TerminalWrapper'),
  { ssr: false },
)

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.type = 'module'
      script.innerHTML = `
        import * as esptool from 'https://unpkg.com/esp-web-flasher@5.1.4/dist/web/index.js?module';
        window.esptoolPackage = esptool;
      `
      document.body.appendChild(script)
    }
  }, [])
  const [tabValue, setTabValue] = useState('upload')
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

      {/* Hier wird die dynamisch importierte TerminalWrapper-Komponente eingebunden */}
      <Tabs
        defaultValue="upload"
        className="w-full"
        onValueChange={value => {
          setTabValue(value)
        }}
      >
        <TabsList className="w-full justify-evenly p-0">
          <TabsTrigger className="w-1/2 text-2xl" value="upload">
            Upload
          </TabsTrigger>
          <TabsTrigger className="w-1/2 text-2xl" value="tutorial">
            Anleitung
          </TabsTrigger>
        </TabsList>
        <div>
          <TabsContent
            forceMount
            className={cva(tabValue === 'upload' ? '' : 'hidden')()}
            value="upload"
          >
            <FlashTool language="de" expand={true}/> 
          </TabsContent>
          <TabsContent value="tutorial">
            <Tutorial />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
