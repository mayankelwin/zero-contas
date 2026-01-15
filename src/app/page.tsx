import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <main className="max-w-xl text-center flex flex-col gap-8">
        {/* Logo / Nome */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          ZERO CONTAS
        </h1>

        {/* Slogan */}
        <p className="text-base sm:text-lg text-muted-foreground">
          Um SaaS de gerenciamento financeiro pessoal para quem quer
          organizar, controlar e simplificar sua vida financeira.
        </p>

        {/* Status */}
        <p className="text-sm text-muted-foreground italic">
          Plataforma em desenvolvimento 🚧
        </p>

        {/* Botão Login */}
        <div className="flex justify-center">
          <Link
            href="/auth"
            className="rounded-full bg-foreground text-background px-8 py-3 font-medium text-sm sm:text-base transition-colors hover:opacity-90"
          >
            Acessar / Login
          </Link>
        </div>

        {/* Rodapé simples */}
        <footer className="pt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} ZERO CONTAS · Todos os direitos reservados
        </footer>
      </main>
    </div>
  );
}
