'use client'
import Chat from './components/Chat'


export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-500">
        <Chat />
      </main>
  )
}