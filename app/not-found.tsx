import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-4 font-serif text-4xl text-primary">Page not found</h1>
      <p className="mt-4 max-w-md text-neutral-600">The page you requested does not exist or may have moved.</p>
      <Link href="/" className="mt-8 rounded bg-primary px-5 py-3 font-semibold text-white">Return home</Link>
    </section>
  );
}
