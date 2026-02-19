export function Footer() {
  return (
    <footer className="border-t-[3px] border-black py-12 bg-black text-gray-300">
      <div className="max-w-[1140px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <span className="font-mono font-bold text-green tracking-[2px] flex items-center gap-1 justify-center md:justify-start mb-2">
            <span className="text-lg">[■]</span> ANONPRINT
          </span>
          <p className="text-sm text-gray-600">
            Print anonymous files online.
            <br />
            Metro Manila delivery.
          </p>
        </div>

        <div className="flex gap-6 flex-wrap justify-center">
          {[
            { href: "#how", label: "How It Works" },
            { href: "#pricing", label: "Pricing" },
            { href: "#order", label: "Order Now" },
            { href: "#faq", label: "FAQ" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-gray-600 uppercase tracking-[1px] hover:text-green transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-xs text-gray-600">
          &copy; 2026 AnonPrint. Your files. Your privacy.
        </p>
      </div>
    </footer>
  );
}
