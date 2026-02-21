const plans = [
  {
    name: "Black & White",
    price: "₱5",
    unit: "/page",
    features: [
      "A4 / Short / Long",
      "Standard 80gsm paper",
      "Great for documents & reports",
    ],
  },
  {
    name: "Full Color",
    price: "₱12",
    unit: "/page",
    featured: true,
    features: [
      "A4 / Short / Long",
      "Vibrant color output",
      "Great for presentations & flyers",
    ],
  },
];

const deliveryTiers = [
  { distance: "Within 10km", price: "₱60" },
  { distance: "10km — 20km", price: "₱100" },
  { distance: "20km+", price: "Based on Lalamove rate" },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-black uppercase tracking-tight mb-3">
          Pricing
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Simple. Transparent. Minimum order ₱200.
        </p>

        {/* Price cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-[700px]">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`border-brutal bg-white hover-brutal ${plan.featured ? "border-green hover-brutal-green" : ""}`}
            >
              {plan.featured && (
                <div className="bg-green text-black font-mono text-xs font-bold tracking-[2px] text-center py-1.5">
                  POPULAR
                </div>
              )}
              <div className="p-8 border-b-[3px] border-black">
                <h3 className="text-xl uppercase font-bold mb-2">
                  {plan.name}
                </h3>
                <div className="font-mono text-4xl font-bold">
                  {plan.price}
                  <span className="text-base text-gray-600">{plan.unit}</span>
                </div>
              </div>
              <ul className="p-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="py-2 text-sm text-gray-600 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-green-dark font-bold">✓ </span>
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Delivery */}
        <div className="border-brutal p-8 bg-black text-white">
          <h3 className="text-xl uppercase font-bold mb-5">
            🚚 Delivery Fee
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {deliveryTiers.map((t) => (
              <div
                key={t.distance}
                className="border-2 border-green/30 p-5 text-center"
              >
                <span className="block text-sm text-gray-300 font-mono mb-2">
                  {t.distance}
                </span>
                <span className="block font-mono text-2xl font-bold text-green">
                  {t.price}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-300">
            Delivery via Lalamove motorcycle courier. Same-day delivery for
            orders before 2:00 PM.
          </p>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Need something extra like binding or lamination? Just mention it in
          the special instructions when you order.
        </p>
      </div>
    </section>
  );
}
