export default function Home() {
  return (
    <main className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row gap-12">
        <section className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.4em] text-secondary">LegalEase</p>
          <h1 className="text-5xl font-bold">Tailwind 4 + daisyUI starter</h1>
          <p className="py-6 text-lg text-base-content/80">
            A modern primary layout with ready-to-use UI components, theme utilities,
            and a cleaner design for your Next.js app.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary">Get started</button>
            <button className="btn btn-outline">Open dashboard</button>
          </div>
        </section>

        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="card-title">Ready to build</h2>
            <p>Tailwind 4 and daisyUI are configured and ready for fast UI work.</p>
            <div className="divider" />
            <ul className="list-disc list-inside space-y-2 text-sm text-base-content/70">
              <li>App Router with global styles</li>
              <li>Utility classes powered by Tailwind</li>
              <li>daisyUI components and themes</li>
            </ul>
            <div className="card-actions justify-end">
              <button className="btn btn-secondary">Customize</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
