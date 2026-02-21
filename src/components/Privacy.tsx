export function Privacy() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-black uppercase tracking-tight mb-3">
          Your Privacy Is The Product
        </h2>
        <p className="text-lg text-gray-300 mb-12">
          We built this service for people who value their privacy. Here&apos;s
          what that means.
        </p>

        {/* What we collect vs what we don't */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="border-2 border-green p-8 bg-green/[0.03]">
            <h3 className="font-mono text-sm font-bold text-green uppercase tracking-[2px] mb-6">
              What We Collect
            </h3>
            <ul className="space-y-4">
              {[
                { item: "Your email", why: "To send tracking updates only" },
                { item: "Your document", why: "To print it — deleted in 24hrs" },
                { item: "Delivery address", why: "For the courier — not stored" },
                { item: "Contact number", why: "For the courier — not stored" },
              ].map((row) => (
                <li key={row.item} className="flex items-start gap-3">
                  <span className="text-green font-bold mt-0.5">→</span>
                  <div>
                    <span className="font-bold text-white">{row.item}</span>
                    <span className="text-gray-300 text-sm block">
                      {row.why}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-2 border-[#ef4444]/30 p-8 bg-[#ef4444]/[0.03]">
            <h3 className="font-mono text-sm font-bold text-[#ef4444] uppercase tracking-[2px] mb-6">
              What We Don&apos;t
            </h3>
            <ul className="space-y-4">
              {[
                "Your name",
                "Your identity",
                "Account or login",
                "Browsing data or cookies",
                "File contents after delivery",
                "Payment details (GCash/Maya handles it)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#ef4444] font-bold">✕</span>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Privacy commitments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "🗑️",
              title: "24hr Deletion",
              desc: "Files permanently wiped within 24 hours after delivery.",
            },
            {
              icon: "👤",
              title: "No Identity",
              desc: "We never ask your name. You're just an order number.",
            },
            {
              icon: "🔒",
              title: "No Accounts",
              desc: "No sign-ups. No passwords. No profiles. Ever.",
            },
            {
              icon: "📧",
              title: "One Email",
              desc: "Used once for tracking. Then we forget you exist.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="border-2 border-green/20 p-6 bg-green/[0.03] transition-all hover:border-green hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[4px_4px_0_var(--color-green-dark)]"
            >
              <div className="text-2xl mb-3">{card.icon}</div>
              <h3 className="text-base font-bold text-green mb-1">
                {card.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
