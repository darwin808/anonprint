const steps = [
  {
    num: "01",
    icon: "📄",
    title: "Upload & Pay",
    desc: "Upload your document, fill in print details, pay via GCash/Maya using our QR code, and attach your payment receipt.",
  },
  {
    num: "02",
    icon: "🖨️",
    title: "We Print",
    desc: "We verify your payment and print your document exactly as specified. Quality checked before dispatch.",
  },
  {
    num: "03",
    icon: "🚀",
    title: "Delivered",
    desc: "Your order is picked up by Lalamove courier and delivered to your door. You'll get tracking via email.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-black uppercase tracking-tight mb-3">
          How It Works
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Three steps. No sign-ups. No questions asked.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <article
              key={step.num}
              className="border-brutal p-10 bg-white hover-brutal"
            >
              <div className="font-mono text-5xl font-bold text-green leading-none mb-4">
                {step.num}
              </div>
              <div className="text-3xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold uppercase mb-3">{step.title}</h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">
                {step.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
