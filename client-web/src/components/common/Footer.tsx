export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center text-sm">
        © {new Date().getFullYear()} PTB • v0
      </div>
    </footer>
  );
}