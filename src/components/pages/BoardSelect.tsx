'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  Cpu,
  SearchIcon,
  CheckCircle,
  InfoIcon,
  PlugZap,
} from 'lucide-react'
import { Terminal } from '@xterm/xterm'
import { EspTerminal } from '../../lib/espTerminal'
import { Progress } from '../ui/progress'
import { FourSquare } from 'react-loading-indicators'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { connectESP, formatMacAddr, sleep } from '../../lib/esp'

interface BoardSelectProps {
  terminal: Terminal | null
}

export default function BoardSelect({ terminal }: BoardSelectProps) {
  // Prüfe, ob der Browser die serielle API unterstützt
  const [progress, setProgress] = useState<number>(0)
  const [sketch, setSketch] = useState<string>('')
  const [flashing, setFlashing] = useState<boolean>(false)
  const [boardFound, setBoardFound] = useState<boolean>(false)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [connecting, setConnecting] = useState<boolean>(false)
  const [debugMode, setDebugMode] = useState<boolean>(false)
  const [baudRate, setBaudRate] = useState<number>(921600)
  const [selected, setSelected] = useState<string>('ota')
  interface EspStub {
    flashData?: (
      buffer: ArrayBuffer,
      onProgress: (bytesWritten: number, totalBytes: number) => void,
      offset: number,
    ) => Promise<void>
    disconnect?: () => Promise<void>
    port?: {
      close?: () => Promise<void>
      addEventListener?: (event: string, handler: () => void) => void
    }
  }
  const [espStub, setEspStub] = useState<EspStub | undefined>(undefined)

  // Use refs for transport/device to avoid re-renders
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const transportRef = useRef<Transport | null>(null)
  const deviceRef = useRef<unknown>(null)

  // --- Modular helpers ---
  async function fetchFirmware(selected: string): Promise<ArrayBuffer> {
    let response
    switch (selected) {
      case 'ota':
        response = await fetch('/mergedOTA.bin')
        break
      case 'circuitpython':
        response = await fetch('/circuitpython9_2_8.bin')
        break
      case 'uf2':
        response = await fetch(
          'tinyuf2-sensebox_mcu_esp32s2-0.35.0-combined.bin',
        )
        break
      case 'basic': 
        response = await fetch('/basic_firmware.bin')
        break
      default:
        response = await fetch('/mergedOTA.bin')
        break
    }
    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Datei: ${response.statusText}`)
    }
    return await response.arrayBuffer()
  }

  function readFirmwareToSketch(buffer: ArrayBuffer) {
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
  }

  // ...existing code...

  const espLoaderTerminal = new EspTerminal(terminal, {
    setProgress,
    setFlashing,
    setUploadSuccess,
  })

  const clickConnect = async () => {
    if (espStub) {
      await espStub.disconnect?.()
      await espStub.port?.close?.()
      setEspStub(undefined)
      return
    }
    const esploader = await connectESP({
      log: (...args: unknown[]) => espLoaderTerminal.writeLine(args.join(' ')),
      debug: (...args: unknown[]) =>
        espLoaderTerminal.writeLine('[DEBUG] ' + args.join(' ')),
      error: (...args: unknown[]) =>
        espLoaderTerminal.writeLine('[ERROR] ' + args.join(' ')),
      baudRate: baudRate,
    })
    setConnecting(true)
    await esploader.initialize()
    console.log(`Connected to ${esploader.chipName}`)
    console.log(`MAC Address: ${formatMacAddr(esploader.macAddr())}`)
    const newEspStub = await esploader.runStub()
    setConnecting(false)
    setEspStub(newEspStub)
    setBoardFound(true)
    try {
      const buffer = await fetchFirmware(selected)
      readFirmwareToSketch(buffer)
    } catch (err) {
      setError(
        'Fehler beim Laden der Firmware: ' +
          (err instanceof Error ? err.message : err),
      )
    }
    newEspStub.port?.addEventListener?.('disconnect', () => {
      setBoardFound(false)
      setEspStub(undefined)
      console.log('Device disconnected')
    })
  }

  const program = async () => {
    setError('')
    setFlashing(true)
    setUploadSuccess(false)
    try {
      if (!espStub) {
        setError('ESP nicht verbunden.')
        setFlashing(false)
        return
      }
      const buffer = await fetchFirmware(selected)
      await espStub.flashData?.(
        buffer,
        (bytesWritten: number, totalBytes: number) => {
          const progress = bytesWritten / totalBytes
          const percentage = Math.floor(progress * 100)
          setProgress(percentage)
          espLoaderTerminal.writeLine(`Flashing... ${percentage}%`)
        },
        0x0,
      )
      await sleep(100)
      espLoaderTerminal.writeLine(`Done!`)
      espLoaderTerminal.writeLine(
        `To run the new firmware please reset your device.`,
      )
      setUploadSuccess(true)
    } catch (e) {
      console.error(e)
      setError('Fehler beim Flashen: ' + (e instanceof Error ? e.message : e))
    } finally {
      setFlashing(false)
    }
  }

  const disconnectBoard = async () => {
    try {
      await transportRef.current?.disconnect?.()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await deviceRef.current?.close?.()
    } catch (err) {
      console.error('Fehler beim Disconnect:', err)
    } finally {
      deviceRef.current = null
      setBoardFound(false)
      setUploadSuccess(false)
      setError('')
      setSketch('')
      setProgress(0)
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
      <CardContent className="flex flex-1 flex-col gap-4 overflow-scroll p-6">
        <div className="flex flex-col space-y-1.5">
          <Label className="flex items-center space-x-2 font-bold text-senseboxGreen">
            <FileText className="h-5 w-5" />
            <span>Sketch auswählen</span>
          </Label>
          <Select value={selected} onValueChange={value => setSelected(value)}>
            <SelectTrigger id="sketch">
              <SelectValue placeholder="Over-the-Air (OTA)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ota">Over-the-Air (OTA)</SelectItem>
              <SelectItem value="basic">senseBox:basic Sketch</SelectItem>
              <SelectItem value="circuitpython">CircuitPython</SelectItem>
              <SelectItem value="uf2">UF2-Bootloader</SelectItem>

            </SelectContent>
          </Select>
        </div>

        <Label className="flex items-center space-x-2 font-bold text-senseboxGreen">
          <Cpu className="h-5 w-5" />
          <span>Board auswählen</span>
        </Label>

        {boardFound ? (
          <Button
            id="boardDisconnect"
            disabled={flashing}
            onClick={disconnectBoard}
            className="w-full border-2 border-solid border-red-500 bg-white text-red-500 hover:bg-red-100"
          >
            <PlugZap className="h-5 w-5" />
            Board trennen
          </Button>
        ) : (
          <Button
            id="boardSelect"
            onClick={clickConnect}
            className="w-full border-2 border-solid border-senseboxGreen bg-white text-senseboxGreen hover:bg-senseboxGreen/20"
          >
            <SearchIcon className="h-5 w-5" />
            Board suchen
          </Button>
        )}
        <Accordion type="single" collapsible>
          <AccordionItem
            value="advanced"
            className="rounded-lg border bg-gray-50 shadow-sm"
          >
            <AccordionTrigger className="rounded-t-lg px-4 py-3 text-lg font-bold text-senseboxGreen hover:bg-green-50 hover:text-green-700">
              Developer Einstellungen
            </AccordionTrigger>

            <AccordionContent className="space-y-4 rounded-b-lg bg-white px-4 py-4">
              {/* Debug Mode Checkbox */}
              <div className="flex items-center space-x-3 rounded-md border border-gray-200 p-2 transition hover:bg-gray-50">
                <input
                  type="checkbox"
                  id="debugMode"
                  checked={debugMode}
                  onChange={e => setDebugMode(e.target.checked)}
                  className="h-4 w-4 accent-senseboxGreen focus:ring-senseboxGreen"
                />
                <Label
                  htmlFor="debugMode"
                  className="cursor-pointer font-semibold text-gray-700"
                >
                  Debug Modus aktivieren
                </Label>
              </div>

              {/* Baudrate Dropdown */}
              <div className="flex flex-col space-y-2 rounded-md border border-gray-200 bg-gray-50 p-3">
                <Label className="text-sm font-bold text-senseboxGreen">
                  Baudrate auswählen
                </Label>
                <Select onValueChange={val => setBaudRate(Number(val))}>
                  <SelectTrigger className="w-full border-gray-300 shadow-sm focus:ring-2 focus:ring-senseboxGreen">
                    <SelectValue placeholder="Wähle Baudrate…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="115200">115200</SelectItem>
                    <SelectItem value="230400">230400</SelectItem>
                    <SelectItem value="460800">460800</SelectItem>
                    <SelectItem value="921600">921600</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex h-full max-h-24 flex-col items-center justify-center gap-4">
          {connecting && (
            <FourSquare color="#669933" size="medium" text="" textColor="" />
          )}
          {!connecting &&
            boardFound &&
            !flashing &&
            !uploadSuccess &&
            !error && (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 p-2 text-senseboxBlue">
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
            <div className="flex items-center justify-center gap-2 rounded-lg bg-green-100 p-2 text-green-600">
              <CheckCircle className="h-12 w-12" />
              <span className="font-extrabold">
                Upload erfolgreich abgeschlossen! Resette die MCU-S2 jetzt neu !
              </span>
            </div>
          )}
          {error && !error.includes('No port selected by the user.') && (
            <div className="rounded-lg bg-red-50 p-2">
              <p className="text-center text-red-600">{error} </p>
              {error.includes('Failed to set control signals.') && (
                <p className="text-center font-semibold text-red-600">
                  Ist die MCU-S2 im Dev Modus?{' '}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto p-4">
        <Button
          onClick={program}
          className="w-full bg-senseboxGreen text-white hover:bg-senseboxGreen/80"
          disabled={!boardFound || sketch === '' || flashing}
        >
          Sketch hochladen!
        </Button>
      </CardFooter>
    </Card>
  )
}
