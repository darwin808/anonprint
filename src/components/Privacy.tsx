const cards = [
  {
    icon: "🗑️",
    title: "Files Deleted in 24hrs",
    desc: "Every uploaded file is permanently wiped from our systems within 24 hours after your order is fulfilled.",
  },
  {
    icon: "👤",
    title: "No Accounts Ever",
    desc: "We don't make you sign up. No usernames, no passwords, no profiles. Just send and print.",
  },
  {
    icon: "🚫",
    title: "Zero Data Retention",
    desc: "We don't store your personal data, browsing history, or file contents. We print it, deliver it, forget it.",
  },
  {
    icon: "📧",
    title: "Email-Only Contact",
    desc: "We only use your email to send order tracking. After delivery, we don't contact you again. Ever.",
  },
];

export function Privacy() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-black uppercase tracking-tight mb-3">
          Your Privacy Is Not Optional
        </h2>
        <p className="text-lg text-gray-300 mb-12">
          It&apos;s our entire business model.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="border-2 border-green/20 p-8 bg-green/[0.03] transition-all hover:border-green hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[4px_4px_0_var(--color-green-dark)]"
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="text-lg font-bold text-green mb-2">
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
