'use client'
import { useState } from 'react'
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
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  FileText,
  Cpu,
  SearchIcon,
  Info,
  CheckCircle,
  InfoIcon,
} from 'lucide-react'
import { ESPLoader, FlashOptions, LoaderOptions, Transport } from 'esptool-js'
import { Terminal } from '@xterm/xterm'
import { Progress } from '../ui/progress'
import { FourSquare } from 'react-loading-indicators'
let chip: string = ''
let esploader: ESPLoader
let transport: Transport
interface BoardSelectProps {
  terminal: Terminal | null
}

export default function BoardSelect({ terminal }: BoardSelectProps) {
  // Prüfe, ob der Browser die serielle API unterstützt
  const [canUseSerial] = useState(() => 'serial' in navigator)
  const serial = navigator['serial']

  const [progress, setProgress] = useState<number>(0)
  const [sketch, setSketch] = useState<string>('')
  const [flashing, setFlashing] = useState<boolean>(false)
  const [boardFound, setBoardFound] = useState<boolean>(false)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [connecting, setConnecting] = useState<boolean>(false)

  // Falls der Browser keine serielle Unterstützung bietet,
  // wird hier ein Disclaimer angezeigt.
  if (!canUseSerial) {
    return (
      <Card className="flex h-full w-full flex-col border-2 border-slate-300 shadow-md">
        <CardHeader className="rounded-t-lg bg-white p-4">
          <div className="flex items-center space-x-2">
            <Info className="h-6 w-6" />
            <CardTitle className="font-bold">
              Browser nicht unterstützt
            </CardTitle>
          </div>
          <CardDescription className="font-semibold">
            Ihr Browser unterstützt die serielle Kommunikation nicht. Bitte
            verwenden Sie Opera, Chrome oder Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const espLoaderTerminal = {
    clean() {
      terminal?.clear()
    },
    writeLine(data: string) {
      const match = data.match(/\((\d+)%\)/)
      if (match) {
        setProgress(parseInt(match[1], 10))
      }

      if (data.includes('Hard resetting via RTS pin...')) {
        console.log('Upload abgeschlossen!')
        setProgress(100)
        setFlashing(false)
        setUploadSuccess(true) // Erfolgsmeldung setzen
      }

      terminal?.writeln(data)
    },
    write(data: string) {
      terminal?.write(data)
    },
  }

  const listSerialPorts = async () => {
    try {
      setError('') // Vorherige Fehler zurücksetzen
      const device = await serial.requestPort({
        filters: [{ usbVendorId: 0x303a }],
      })
      
      setConnecting(true)

      transport = new Transport(device)
      const flashOptions = {
        transport,
        baudrate: 115200,
        terminal: espLoaderTerminal,
        debugLogging: false,

      } as LoaderOptions
      esploader = new ESPLoader(flashOptions)
      chip = await esploader.main()
      console.log('Connected to:', chip)
      setBoardFound(true)

      // Lade die Datei "mergedOTA.bin" aus "public/"
      const response = await fetch('/mergedOTA.bin')
      if (!response.ok) {
        throw new Error(`Fehler beim Abrufen der Datei: ${response.statusText}`)
      }

      const buffer = await response.arrayBuffer()
      const blob = new Blob([buffer])
      const reader = new FileReader()

      reader.onload = function () {
        setSketch(reader.result as string)
      }
      reader.onerror = function () {
        console.error('Fehler beim Lesen der Datei:', reader.error)
        setError('Fehler beim Lesen der Datei.')
      }

      reader.readAsBinaryString(blob)
    } catch (error) {
      console.error('Fehler beim Auflisten der seriellen Ports:', error)
      setError(
        'Fehler beim Auflisten der seriellen Ports: ' +
          (error instanceof Error ? error.message : error),
      )
      setBoardFound(false)
    } finally {
      setConnecting(false)
    }
  }

  const flashSketch = async () => {
    try {
      setError('') // Vorherige Fehler zurücksetzen
      setFlashing(true)
      setUploadSuccess(false) // Status zurücksetzen

      const flashOptions: FlashOptions = {
        fileArray: [{ data: sketch, address: 0x0 }],
        flashSize: 'keep',
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          setProgress((written / total) * 100)
        },
      } as FlashOptions

      await esploader.writeFlash(flashOptions)
      await esploader.after()
    } catch (error) {
      console.error('Fehler beim Flashen:', error)
      setError(
        'Fehler beim Flashen: ' +
          (error instanceof Error ? error.message : error),
      )
    } finally {
      setFlashing(false)
      transport?.disconnect()
            

    }
  }

  return (
    <Card className="flex h-full w-full flex-col border-2 border-slate-300 shadow-md">
      <CardHeader className="border-b border-slate-200 px-4 py-3">
      <h2 className="text-2xl font-bold text-slate-800">Sketch hochladen!</h2>

        <CardDescription className="mt-1 text-lg text-slate-600">
          Lade einen Sketch auf die MCU-S2 hoch
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 overflow-scroll flex-col gap-4 p-6">
        <div className="flex flex-col space-y-1.5">
          <Label className="flex items-center space-x-2 font-bold text-senseboxGreen">
            <FileText className="h-5 w-5" />
            <span>Sketch auswählen</span>
          </Label>
          <Select disabled={true}>
            <SelectTrigger id="sketch">
              <SelectValue placeholder="Over-the-Air (OTA)" />
            </SelectTrigger>
          </Select>
        </div>

        <Label className="flex items-center space-x-2 font-bold text-senseboxGreen">
          <Cpu className="h-5 w-5" />
          <span>Board auswählen</span>
        </Label>
        <Button
          id="boardSelect"
          onClick={listSerialPorts}
          className={`w-full border-2 border-solid ${
            boardFound ? 'border-green-500' : 'border-senseboxGreen'
          } bg-white text-senseboxGreen hover:bg-senseboxGreen/20`}
        >
          <SearchIcon className="h-5 w-5" />{' '}
          {boardFound ? 'Board erkannt!' : 'Board suchen'}
        </Button>

        <div className="flex h-full max-h-24 flex-col items-center justify-center gap-4">
          {connecting && (
          <FourSquare color="#669933" size="medium" text=""  textColor="" />
          )}
          {!connecting &&
            boardFound &&
            !flashing &&
            !uploadSuccess &&
            !error && (
              <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg text-senseboxBlue">
                <InfoIcon className="h-12 w-12" />
                <span className="font-extrabold">
                  Verbindung erfolgreich hergestellt! Du kannst jetzt den Sketch
                  hochladen.
                </span>
              </div>
            )}
          {flashing && (
            <>
              <Progress value={progress} />
              <p className="p-1 text-center text-gray-600">
                Sketch wird geflasht...
              </p>
            </>
          )}
          {uploadSuccess && (
            <div className="flex items-center justify-center gap-2 bg-green-100 p-2 rounded-lg text-green-600">
              <CheckCircle className="h-12 w-12" />
              <span className="font-extrabold">
                Upload erfolgreich abgeschlossen! Die MCU-S2 ist jetzt
                OTA-fähig!
              </span>
            </div>
          )}
          {error && !error.includes('No port selected by the user.') && 
          <div className='bg-red-50 p-2 rounded-lg'>
              <p className=" text-center text-red-600">{error} </p>
              {error.includes('Failed to set control signals.') && <p className='text-center  text-red-600 font-semibold'>Ist die MCU-S2 im Dev Modus? </p>}
            </div>}
          
        </div>
      </CardContent>
      <CardFooter className="mt-auto p-4">
        <Button
          onClick={flashSketch}
          className="w-full bg-senseboxGreen text-white hover:bg-senseboxGreen/80"
          disabled={!boardFound || sketch === '' || flashing}
        >
          Sketch hochladen!
        </Button>
      </CardFooter>
    </Card>
  )
}
