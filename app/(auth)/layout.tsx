export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo o Header (opcional) */}
      <div className="absolute top-4 left-4">
        <h2 className="text-xl font-bold text-gradient">
          Sistema de Gestión
        </h2>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>

      {/* Footer (opcional) */}
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>© 2025 Sistema de Gestión de Personal. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
