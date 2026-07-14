export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center p-8 bg-zinc-900 border border-white/10 rounded-xl max-w-md">
        <h1 className="text-4xl font-heading font-bold text-primary mb-4">404</h1>
        <p className="text-lg text-white/70 mb-6 font-light">
          System pathway not found. The route you requested does not exist.
        </p>
        <a href="/" className="px-6 py-3 bg-white text-black font-semibold rounded hover:bg-primary hover:text-white transition-colors uppercase text-sm tracking-wider">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
