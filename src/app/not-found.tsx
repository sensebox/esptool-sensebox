import { redirect } from 'next/navigation'

// Unknown routes (e.g. a mistyped sketch permalink) fall back to the start page
export default function NotFound() {
  redirect('/')
}
