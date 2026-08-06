import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="text-zinc-500">Could not find requested resource</p>
      <Link href="/" className="text-blue-600 underline">
        Return Home
      </Link>
    </div>
  );
}
