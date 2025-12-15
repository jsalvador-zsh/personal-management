import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Página no encontrada</h2>
        <p className="max-w-md text-muted-foreground">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
