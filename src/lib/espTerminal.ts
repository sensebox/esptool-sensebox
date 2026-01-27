// espTerminal.ts
// Utility for handling ESP terminal logging and progress updates
import { Terminal } from '@xterm/xterm'

export interface EspTerminalOptions {
  setProgress?: (progress: number) => void
  setFlashing?: (flashing: boolean) => void
  setUploadSuccess?: (success: boolean) => void
}

export class EspTerminal {
  private terminal: Terminal | null
  private setProgress?: (progress: number) => void
  private setFlashing?: (flashing: boolean) => void
  private setUploadSuccess?: (success: boolean) => void

  constructor(terminal: Terminal | null, options: EspTerminalOptions = {}) {
    this.terminal = terminal
    this.setProgress = options.setProgress
    this.setFlashing = options.setFlashing
    this.setUploadSuccess = options.setUploadSuccess
  }

  clean() {
    this.terminal?.clear()
  }

  writeLine(data: string) {
    const match = data.match(/\((\d+)%\)/)
    if (match && this.setProgress) {
      this.setProgress(parseInt(match[1], 10))
    }
    if (data.includes('Hard resetting via RTS pin...')) {
      this.setProgress?.(100)
      this.setFlashing?.(false)
      this.setUploadSuccess?.(true)
    }
    this.terminal?.writeln(data)
  }

  write(data: string) {
    this.terminal?.write(data)
  }
}
