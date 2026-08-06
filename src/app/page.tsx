import Header from "@/components/layout/header/Header";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Header />
      <h1 className="text-4xl font-bold">Welcome to Madarik</h1>
      <p className="mt-4 text-zinc-500">Modular Next.js Application Architecture</p>
    </main>
  );
}
