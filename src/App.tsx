import { BrowserRouter, Link, Route, Routes } from 'react-router'
import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <BrowserRouter>
      <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-5 px-6 py-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

function HomePage() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Abakusrevyen</h1>
      <p className="text-muted-foreground">En ny nettside er under utvikling.</p>
    </>
  )
}

function NotFoundPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Fant ikke siden</h1>
      <p className="text-muted-foreground">Siden finnes ikke.</p>
      <Button asChild className="self-start">
        <Link to="/">Til startsiden</Link>
      </Button>
    </>
  )
}
