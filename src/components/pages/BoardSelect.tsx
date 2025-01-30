'use client'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UploadCloud, FileText, Cpu, SearchIcon } from 'lucide-react'
import { ESPLoader, FlashOptions, LoaderOptions, Transport } from 'esptool-js'
import { Terminal } from '@xterm/xterm'

const device = null
let transport: Transport
let chip: string = ''
let esploader: ESPLoader

export default function BoardSelect() {
  const [canUseSerial] = useState(() => 'serial' in navigator)
  const serial = navigator['serial']

  const [sketch, setSketch] = useState<string>('')

  const term = new Terminal({ cols: 120, rows: 40 })

  const espLoaderTerminal = {
    clean() {
      term.clear()
    },
    writeLine(data: string) {
      term.writeln(data)
    },
    write(data: string) {
      term.write(data)
    },
  }
  const listSerialPorts = async () => {
    try {
      const device = await serial.requestPort({
        // only show senseboxes
        // filters: [{ usbVendorId: 0x303a, usbProductId: 0x81b8 }],
      })
      const transport = new Transport(device)
      const flashOptions = {
        transport,
        baudrate: parseInt('115200'),
        terminal: espLoaderTerminal,
        debugLogging: false,
      } as LoaderOptions
      esploader = new ESPLoader(flashOptions)

      chip = await esploader.main()
      console.log('Connected to: ', chip)

      console.log('esploader', esploader)

      // Load OTA sketch
      const response = await fetch('http://localhost:3000/api/ota')
      const buffer = await response.arrayBuffer()
      const blob = new Blob([buffer])

      const reader = new FileReader()

      reader.onload = function () {
        console.log('Binary String:', reader.result as string) // Binary string output
        setSketch(reader.result as string)
      }

      reader.onerror = function () {
        console.error('Error reading binary file:', reader.error)
      }

      reader.readAsBinaryString(blob)
    } catch (error) {
      console.error('Error listing serial ports:', error)
    }
  }

  const flashSketch = async () => {
    try {
      const flashOptions: FlashOptions = {
        fileArray: [{ data: sketch, address: 0x0 }],
        flashSize: 'keep',
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          // progressBars[fileIndex].value = (written / total) * 100
          console.log('Progress: ', (written / total) * 100)
        },
        // calculateMD5Hash: image =>
        //   CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)),
      } as FlashOptions
      console.log('Flashing sketch...')
      await esploader.writeFlash(flashOptions)
      await esploader.after()
    } catch (error) {
      console.error('Error flashing sketch:', error)
    }
  }

  return (
    <Card className="flex h-full w-full flex-col border-2 border-slate-300 shadow-md">
      <CardHeader className="rounded-t-lg bg-white p-4">
        <div className="flex items-center space-x-2">
          <UploadCloud className="h-6 w-6" />
          <CardTitle className="font-bold">Sketch hochladen!</CardTitle>
        </div>
        <CardDescription className="font-semibold">
          Lade einen Sketch auf die MCU-S2 hoch
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col space-y-1.5">
          <Label
            htmlFor="sketch"
            className="flex items-center space-x-2 font-bold text-senseboxGreen"
          >
            <FileText className="h-5 w-5" />
            <span>Sketch auswählen</span>
          </Label>
          <Select disabled={true}>
            <SelectTrigger id="sketch">
              <SelectValue placeholder="Over-the-Air (OTA)" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="ota">O</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label
            htmlFor="boardSelect"
            className="flex items-center space-x-2 font-bold text-senseboxGreen"
          >
            <Cpu className="h-5 w-5" />
            <span>Board auswählen</span>
          </Label>
          <Button
            id="boardSelect"
            onClick={() => listSerialPorts()}
            className="w-full border-2 border-solid border-senseboxGreen bg-white text-senseboxGreen hover:bg-senseboxGreen/20"
          >
            <SearchIcon className="h-5 w-5" /> Board suchen
          </Button>
        </div>
      </CardContent>
      <CardFooter className="mt-auto p-4">
        <Button
          onClick={() => flashSketch()}
          className="w-full bg-senseboxGreen text-white hover:bg-senseboxGreen/80"
          disabled={sketch === ''}
        >
          Sketch hochladen!
        </Button>
      </CardFooter>
    </Card>
  )
}
