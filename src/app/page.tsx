import BoardSelect from '@/components/pages/BoardSelect'
import TerminalLogs from '@/components/ui/TerminalLogs'

export default function Home() {
  return (
    <div className='flex gap-4 items-center justify-center h-screen'>
      <div className='w-96 h-96'>
      <BoardSelect />

      </div>
      <div className='w-96 h-96'>
      <TerminalLogs logs='Waiting on input .. ' />

      </div>
    </div>
  )
}
