import Link from "next/link";

export function CtaSection() {
  return (
    <section className="mb-20 text-center py-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        Ready to explore computational law?
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Join our community, try L4, or get in touch to learn how we&apos;re building
        the future of legal technology.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/community"
          className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-hover transition-colors"
        >
          Join the Community
        </Link>
        <a
          href="https://github.com/legalese/l4-ide"
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors"
        >
          Star on GitHub
        </a>
      </div>
    </section>
  );
}
