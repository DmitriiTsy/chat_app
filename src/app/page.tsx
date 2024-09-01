'use client'
import Chat from './components/Chat'
import { Provider } from 'react-redux'
import { store } from './store/store'

export default function Home() {
  return (
    <Provider store={store}>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-500">
        <Chat />
      </main>
    </Provider>
  )
}