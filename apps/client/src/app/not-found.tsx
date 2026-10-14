import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link
        href="/"
        className="text-primary underline-offset-4 hover:underline"
      >
        Go home
      </Link>
    </main>
  );
}
