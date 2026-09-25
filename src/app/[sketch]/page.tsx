import { notFound } from 'next/navigation'
import Home from '@/components/pages/Home'
import { SKETCHES, type Sketch } from '@/lib/sketches'

export const dynamicParams = false

export function generateStaticParams() {
  return SKETCHES.map((sketch) => ({ sketch }))
}

const Page = async ({ params }: { params: Promise<{ sketch: string }> }) => {
  const { sketch } = await params
  if (!SKETCHES.includes(sketch as Sketch)) notFound()

  return (
    <div>
      <Home sketch={sketch as Sketch} />
    </div>
  )
}

export default Page
